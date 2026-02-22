#!/usr/bin/env python3
"""Build browser-ready JSON for the BioCAD midterm review mini-app.

This script reads the locked source files for the midterm review feature:
- `docs/midterm_review/source/topics.yaml`
- `docs/midterm_review/source/questions/<topic_slug>.txt`

It then produces fast-loading, structured JSON assets consumed by the web UI:
- `docs/midterm_review/data/topics_flat.json`
- `docs/midterm_review/data/question_bank.json`

`topics_flat.json` is a flattened list of leaf topics (each with `topic_slug`, `title`,
`scope`, and a `path` showing the topic hierarchy).

`question_bank.json` is a mapping from `topic_slug` to a list of question objects.
Each question object is taken directly from the per-topic `.txt` file, which is
parsed as a stream of YAML documents separated by `---`.

How to run (from the repo root):

  python docs/midterm_review/build/build_data.py

To override paths, you can run:

  python docs/midterm_review/build/build_data.py \
    --topics docs/midterm_review/source/topics.yaml \
    --questions-dir docs/midterm_review/source/questions \
    --out-dir docs/midterm_review/data

If you omit the flags, the script uses its built-in defaults.
"""

import argparse
import json
import re
import sys
from pathlib import Path

import yaml

META_KEYS = {"title", "scope", "description", "notes"}


def die(msg: str, code: int = 1) -> None:
    print(f"ERROR: {msg}", file=sys.stderr)
    raise SystemExit(code)


def flatten_topics(topics_obj):
    out = []

    def is_leaf(node):
        if not isinstance(node, dict):
            return False
        if "scope" not in node:
            return False
        child_dict_keys = [k for k, v in node.items() if isinstance(v, dict) and k not in META_KEYS]
        return len(child_dict_keys) == 0

    def walk(d, path):
        if not isinstance(d, dict):
            return
        for k, v in d.items():
            if k in META_KEYS:
                continue
            if isinstance(v, dict):
                if is_leaf(v):
                    title = v.get("title", k)
                    raw_scope = v.get("scope", "")
                    scope = normalize_wrapped_paragraphs("" if raw_scope is None else str(raw_scope))
                    out.append(
                        {
                            "topic_slug": str(k),
                            "title": str(title),
                            "scope": scope,
                            "path": [str(x) for x in path],
                        }
                    )
                else:
                    walk(v, path + [k])

    walk(topics_obj, [])
    return out


def load_topics_yaml(topics_path: Path):
    if not topics_path.exists():
        die(f"topics file not found: {topics_path}")
    try:
        obj = yaml.safe_load(topics_path.read_text(encoding="utf-8"))
    except Exception as e:
        die(f"failed to parse topics yaml: {topics_path} ({e})")
    if not isinstance(obj, dict):
        die(f"topics yaml must parse to a mapping at top level: {topics_path}")
    topics_flat = flatten_topics(obj)
    if not topics_flat:
        die(f"no leaf topics discovered in topics yaml: {topics_path}")
    seen = set()
    for t in topics_flat:
        s = t["topic_slug"]
        if s in seen:
            die(f"duplicate topic_slug in topics yaml: {s}")
        seen.add(s)
    return topics_flat


def sanitize_question_yaml(text: str) -> str:
    lines = text.splitlines()
    out = []
    in_choices = False
    choices_indent = None

    for line in lines:
        if not in_choices:
            m = re.match(r"^(\s*)choices:\s*$", line)
            if m:
                in_choices = True
                choices_indent = len(m.group(1))
                out.append(line)
                continue
            out.append(line)
            continue

        indent = len(line) - len(line.lstrip(" "))
        if line.strip() == "":
            out.append(line)
            continue
        if indent <= (choices_indent or 0):
            in_choices = False
            choices_indent = None
            out.append(line)
            continue

        m = re.match(r"^(\s*)([A-Z]):\s*(.+)\s*$", line)
        if not m:
            out.append(line)
            continue

        lead, key, val = m.group(1), m.group(2), m.group(3)
        v = val.strip()

        needs_quote = False
        if v.startswith("|") or v.startswith(">"):
            needs_quote = False
        elif v.startswith("[") or v.startswith("{"):
            if " for " in v or " if " in v:
                needs_quote = True
            else:
                if v.startswith("["):
                    close = v.rfind("]")
                    if close != -1 and v[close + 1 :].strip() != "":
                        needs_quote = True
                    else:
                        needs_quote = False
                else:
                    close = v.rfind("}")
                    if close != -1 and v[close + 1 :].strip() != "":
                        needs_quote = True
                    else:
                        needs_quote = False
        elif v.startswith('"') and v.endswith('"'):
            needs_quote = False
        elif v.startswith("'"):
            needs_quote = not v.endswith("'")
        else:
            if " " in v or "\t" in v:
                needs_quote = True

        if not needs_quote:
            out.append(line)
            continue

        escaped = v.replace("\\", "\\\\").replace('"', '\\"')
        out.append(f"{lead}{key}: \"{escaped}\"")

    return "\n".join(out) + ("\n" if text.endswith("\n") else "")


# Helper to normalize wrapped paragraphs in prose fields (e.g., explanation).
def normalize_wrapped_paragraphs(text: str) -> str:
    """Collapse single line-wrap newlines while preserving paragraph breaks.

    Intended for prose fields that come from YAML block scalars (e.g., explanation).
    Example:
      "line one\nline two\n\nnext para" -> "line one line two\n\nnext para"
    """
    if not isinstance(text, str) or "\n" not in text:
        return text

    # Normalize line endings first.
    s = text.replace("\r\n", "\n").replace("\r", "\n")

    paragraphs = s.split("\n\n")
    normalized = []
    for p in paragraphs:
        # Preserve intentionally blank paragraphs as-is.
        if p.strip() == "":
            normalized.append(p)
            continue
        # Collapse intra-paragraph hard wraps/newlines to spaces.
        lines = [ln.strip() for ln in p.split("\n")]
        normalized.append(" ".join([ln for ln in lines if ln != ""]))

    return "\n\n".join(normalized)


def parse_question_file(path: Path, *, allow_missing: bool = False):
    if not path.exists():
        if allow_missing:
            print(f"WARN: missing question file (skipping): {path}", file=sys.stderr)
            return []
        die(f"missing question file: {path}")

    text = path.read_text(encoding="utf-8").strip()
    if not text:
        die(f"empty question file: {path}")

    try:
        docs = list(yaml.safe_load_all(text))
    except Exception:
        try:
            fixed = sanitize_question_yaml(text)
            docs = list(yaml.safe_load_all(fixed))
        except Exception as e:
            die(f"failed to parse question file as YAML docs: {path} ({e})")

    docs = [d for d in docs if d is not None]
    if not docs:
        die(f"no question objects found in: {path}")

    out = []
    required = {"slug", "difficulty", "topic", "question", "choices", "answer", "explanation"}
    for i, d in enumerate(docs):
        if not isinstance(d, dict):
            die(f"question block {i} in {path} is not a mapping")

        missing = sorted(list(required - set(d.keys())))
        if missing:
            slug = d.get("slug")
            slug_part = f" (slug={slug})" if slug else ""
            die(f"question block {i} in {path}{slug_part} missing keys: {', '.join(missing)}")

        # Normalize prose wrapping from YAML block scalars so UI rendering does not
        # show manual source line wraps as visible line breaks.
        d["explanation"] = normalize_wrapped_paragraphs(str(d["explanation"]))

        choices = d["choices"]
        answer = d["answer"]

        if isinstance(choices, dict):
            if answer not in choices:
                die(f"question block {i} in {path} answer '{answer}' not in choices keys")
        elif isinstance(choices, list):
            valid = {chr(65 + j) for j in range(len(choices)) if j < 26}
            if answer not in valid:
                die(f"question block {i} in {path} answer '{answer}' not in {sorted(valid)}")
            if len(choices) < 2:
                die(f"question block {i} in {path} has too few choices")
        else:
            die(f"question block {i} in {path} choices must be dict or list")

        out.append(d)

    return out


def build_bank(topics_flat, questions_dir: Path, *, allow_missing: bool = False):
    if not questions_dir.exists():
        die(f"questions directory not found: {questions_dir}")

    bank = {}
    global_slugs = set()

    for t in topics_flat:
        slug = t["topic_slug"]
        qpath = questions_dir / f"{slug}.txt"
        qs = parse_question_file(qpath, allow_missing=allow_missing)

        for q in qs:
            s = q.get("slug")
            if s in global_slugs:
                die(f"duplicate question slug across bank: {s}")
            global_slugs.add(s)

        bank[slug] = qs

    return bank


def write_json(path: Path, obj):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(obj, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--topics", default="docs/midterm_review/source/topics.yaml")
    ap.add_argument("--questions-dir", default="docs/midterm_review/source/questions")
    ap.add_argument("--out-dir", default="docs/midterm_review/data")
    ap.add_argument("--allow-missing-question-files", action="store_true")
    args = ap.parse_args()

    repo_root = Path.cwd()
    topics_path = (repo_root / args.topics).resolve()
    questions_dir = (repo_root / args.questions_dir).resolve()
    out_dir = (repo_root / args.out_dir).resolve()

    topics_flat = load_topics_yaml(topics_path)
    bank = build_bank(topics_flat, questions_dir, allow_missing=args.allow_missing_question_files)

    write_json(out_dir / "topics_flat.json", topics_flat)
    write_json(out_dir / "question_bank.json", bank)

    print(f"Wrote {out_dir / 'topics_flat.json'}")
    print(f"Wrote {out_dir / 'question_bank.json'}")


if __name__ == "__main__":
    main()
