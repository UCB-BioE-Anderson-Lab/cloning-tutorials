"""SUPERSEDED -- DO NOT RUN.  2026-11-17.

This generated the rough cut on 2026-11-10 and nothing since.  The deck it
describes no longer exists: sources 35 and 42 have been removed, four slides
have been added, RNA-seq has moved into Tools, the old "RNAs and DNAs"
section has been split into functional nucleic acids and regulatory DNA, and
every section file below has been renumbered or renamed.

Running this would overwrite all of that with the rough cut again -- every
redrawn figure, every piece of narration, every correction.  It is kept only
as the record of how the conversion was first done.  The live structure lives
in lecture.js, and PLAN.txt says why it is what it is.
"""

import xml.etree.ElementTree as ET, os, html, re, glob
A='{http://schemas.openxmlformats.org/drawingml/2006/main}'
P='{http://schemas.openxmlformats.org/presentationml/2006/main}'
RAW='raw'
OUT='/Users/jcandersonucb/Documents/GitHub/cloning-tutorials/docs/lectures/140L/12-multiplex-characterization'

FIG={7:"07-genome.png",8:"08-pools.png",9:"09-twist.png",10:"10-nextgen.png",
     11:"11-ortholog.png",13:"13-ngs.png",20:"20-emulsion.png",21:"21-ddpcr.png",
     22:"22-onbead.png",23:"23-txtl.png",25:"25-selex.png",26:"26-rnaseq.png",
     27:"27-pars.png",28:"28-shape.png",29:"29-shapeseq.png",31:"31-phage.png",
     32:"32-onehybrid.png",33:"33-logos.png",35:"35-trmr.png",36:"36-creseq.png",
     37:"37-ponder.png",39:"39-y2h.png",42:"42-projects.png"}

SECTIONS=[("00-front-matter.html","Introduction","lecture",[1]),
          ("01-libraries.html","Types of Libraries","section",list(range(2,12))),
          ("02-tools.html","Tools of the Trade","section",list(range(12,24))),
          ("03-rna-dna.html","RNAs and DNAs","section",list(range(24,30))),
          ("04-protein.html","Protein Function","section",list(range(30,34))),
          ("05-properties.html","Biological Properties","section",list(range(34,37))),
          ("06-questions.html","Questions to Ponder","section",list(range(37,40))),
          ("07-all-hands.html","All-Hands","section",list(range(40,44)))]
DIVIDER={1,2,12,24,30,34,37,40,41}

def notes(n):
    try: rels=ET.parse(f'{RAW}/ppt/slides/_rels/slide{n}.xml.rels').getroot()
    except Exception: return ""
    p=None
    for r in rels:
        if r.get('Type').endswith('notesSlide'):
            p=os.path.normpath(os.path.join(f'{RAW}/ppt/slides', r.get('Target')))
    if not p or not os.path.exists(p): return ""
    out=[]
    for sp in ET.parse(p).getroot().iter(P+'sp'):
        ph=sp.find('.//'+P+'ph')
        if ph is None or ph.get('type')!='body': continue
        for para in sp.iter(A+'p'):
            s=''.join(x.text or '' for x in para.iter(A+'t'))
            if s.strip(): out.append(s.strip())
    return '\n'.join(out)

def blocks(n):
    t=ET.parse(f'{RAW}/ppt/slides/slide{n}.xml').getroot()
    out=[]
    for sp in t.iter(P+'sp'):
        lines=[]
        for para in sp.iter(A+'p'):
            s=''.join(x.text or '' for x in para.iter(A+'t'))
            lines.append(s.rstrip())
        lines=[l for l in lines if l.strip()]
        if lines: out.append(lines)
    return out

def esc(s): return html.escape(s, quote=False)
URL=re.compile(r'^\s*https?://')

HEAD='''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="robots" content="noindex,nofollow">
<title>%s &ndash; Multiplex Characterization</title>
<link rel="stylesheet" href="../../deck.css">
<style>
.slide figure.fig{flex:1 1 auto;min-height:0;display:flex;align-items:center;
  justify-content:center;margin:6px 0 0}
.slide figure.fig img{max-width:100%%;max-height:100%%;width:auto;height:auto;
  object-fit:contain}
.slide .big{flex:1 1 auto;display:flex;align-items:center;justify-content:center}
.slide .big p{font-size:84px;font-family:var(--sans);font-weight:700;margin:0;
  text-align:center;line-height:1.1}
.slide ul.tight li{font-size:28px;margin-bottom:12px}
.slide ul.fill{margin-top:auto;margin-bottom:auto}
.slide ul.fill li{font-size:28px;margin-bottom:18px}
.slide pre.seqblock{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;
  font-size:13px;line-height:1.35;white-space:pre-wrap;word-break:break-all;
  margin:10px 0 0;color:var(--ink)}
.slide p.sub{font-size:26px;color:var(--muted);margin:0 0 6px}
</style>
</head>
<body>

'''

for fname, title, kind, slides in SECTIONS:
    body=[]
    for n in slides:
        bl=blocks(n)
        nt=notes(n)
        srcs=[]
        texts=[]
        for b in bl:
            if all(URL.match(l) for l in b):
                srcs.extend(b); continue
            texts.append(b)
        head = texts[0][0] if texts else ""
        rest = texts[1:] if texts else []
        body.append(f'<!-- ---------------------------------------------------------------- {n} -->')
        bg = ' data-bg="lecture"' if n==1 else (' data-bg="section"' if n in DIVIDER else '')
        body.append(f'<article class="slide"{bg}>')
        if n in DIVIDER:
            body.append(f'  <div class="big"><p>{esc(head)}</p></div>')
            for b in rest:
                for l in b: body.append(f'  <p class="sub">{esc(l)}</p>')
        else:
            body.append(f'  <h1>{esc(head)}</h1>')
            # extra lines in the TITLE block are a subtitle, not bullets --
            # source 4 is "Alanine Scan Libraries / or more generally Site
            # Saturation Variant Libraries (Twist)" in one text box
            for l in texts[0][1:]:
                body.append(f'  <p class="sub">{esc(l)}</p>')
            for b in rest:
                long = any(len(l)>120 for l in b)
                if long:
                    body.append('  <pre class="seqblock">'+esc('\n'.join(b))+'</pre>')
                else:
                    body.append('  <ul class="tight">')
                    for l in b: body.append(f'    <li>{esc(l)}</li>')
                    body.append('  </ul>')
            if n in FIG:
                # provisional alt: the slide's own title.  True, and better
                # than a literal TODO, which a screen reader would read out.
                body.append(f'  <figure class="fig"><img src="img/{FIG[n]}" '
                            f'alt="Figure from the slide {esc(head)}."></figure>')
        for s in srcs:
            body.append(f'  <p class="src">{esc(s)}</p>')
        body.append(f'  <template class="notes">{esc(nt)}</template>')
        body.append(f'  <template class="desc">{esc(head)}.</template>')
        body.append('</article>')
        body.append('')
    out=(HEAD % title)+'\n'.join(body)+'\n<script src="../../deck.js" defer></script>\n<script src="lecture.js" defer></script>\n</body>\n</html>\n'
    open(os.path.join(OUT,fname),'w',encoding='utf8').write(out)
    print("wrote", fname, len(slides), "slides")
