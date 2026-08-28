# 13. Equipment Training (the QR shorts)

- **Page:** `docs/trainings/qr_training.md` — plus each instrument's own page
- **Proposed IDs:** `B144-Equip-<instrument>` — **not** part of the pP6 numbering, since
  these are not tied to the experiment and should outlive it
- **Prior versions:** none for the instruments below
- **Runtime:** 60–120 s each. These are shorts, not lessons.
- **Hosting:** **YouTube unlisted, without exception.** These are reached by scanning a QR
  code off a machine. A CalNet login prompt between a student and an instrument they are
  standing in front of defeats the purpose, and the QR registry's existing safety entries
  are already public YouTube links.

## The distribution mechanism already exists

`docs/assets/qr_registry.csv` drives `docs/trainings/qr_training.md`, and **the QR codes are
already printed and on the machines.** The renderer already detects YouTube URLs and labels
them `[Video]` instead of `[Start Training]`. So a video for an instrument becomes reachable
from the bench by editing one CSV cell — no new mechanism, no new signage.

That makes these the cheapest videos in the whole plan to *distribute*, and the reason to
batch several into one session.

## Priority order

### 1. Tecan MNano — **highest priority**

New instrument, no footage, `docs/trainings/tecan_mnano.md` is one line, and the QR is
**live and marked Mandatory**. Today it is a dead end.

**Cut this from the BestP shoot (plan 12, shot 4).** Same take, two destinations. Do not
film it twice.

### 2. EchoTherm

Also cuttable from another shoot — the transformation video (plan 8, shot 3). The page
`docs/trainings/echotherm.md` is already complete and correct, so the video just needs to
match it:
- Toggle at the **back right corner**
- Front plate **4 °C**, back plate **42 °C**, already programmed
- Up+down arrows together to switch between Front and Back
- **Reset to 4/42 when finished**
- Power off after use

### 3. Microwave

Not part of the wetlab tutorial series — this is equipment training, lower priority than
anything in videos 1–12. The two documented agarose recipes differ because they describe
different scales (the 50× TAE is diluted into a large jug, not the 500 mL bottle); JCA has
confirmed the numbers are right.

The short covers:
- Trained personnel only; thermal gloves; inspect before use; never run empty
- Microwave-safe containers only; **loosen caps before heating**
- **Re-melting LB agar** — 30–60 s bursts, rest between, stop at boiling, cool to ~55 °C
  before antibiotics
- **Superheating** — the hazard the safety page names. Show swirling between intervals and
  say why bursts beat one continuous run
- Preventing hard-to-clean gels: dilute remnants, don't boil over, don't leave unattended

### 4. Flame Sterilization — ⚠️ ON HOLD

**Do not film this until README issue 3 is settled.** Flames are no longer used for plating,
and it is unresolved whether flame sterilization survives at all as a hood-only supervisor
procedure. If it has been retired lab-wide, this page, its QR code, and its SOP links should
be withdrawn rather than filmed.

If it does survive, the constraints below apply. `docs/trainings/flame_sterilization.md` restricts
this to **supervisors who have completed the training**, in the **chemical hood only**. If
students are present at a shoot, they may be in the room but **must not be the hands on
camera**.

Note also that flames are **out of the student transformation workflow** (see plan 8), so
this short's audience is supervisors, not the class. Priority accordingly.

If filmed, it must match the page and the two signed SOPs exactly:
- Chemical hood only; blue fire-resistant B144 coats, **not** the B146 tissue-culture coats
- Smallest practical solvent volume, **never exceed 100 mL**
- **12 inches** minimum between flame and solvent container
- Nothing combustible within **two feet**; not under shelves or overhangs
- Stable straight-walled glass or metal container, restrained or wider than tall
- **Order matters: dip → remove excess → flame.** Never flame first then dip
- Work **standing up**
- Emergency response: stop-drop-and-roll or safety shower; flush burns with low-pressure
  water, no ice, no rubbing; eyewash 15 minutes; 911 if life-threatening

**Do not stage an accident.** Describe the emergency response; don't demonstrate it.

### 5. The rest, as time allows

Each already has a written page to shoot against: **ProFlex** thermocycler, **Allegra V-15R**
centrifuge (rotor balancing is the shot worth having), **Q500 sonicator** (hearing
protection), **−80 freezer** (frost control and access), **chemical cabinets**.

## Format for every short

Keep them rigidly consistent so students learn the shape:

1. **Name the instrument and show where it is** (5 s)
2. **Say who may use it** — the three signage tiers: Supervisors Only / Training Required /
   Training Available (10 s)
3. **The procedure**, start to finish, no cuts if possible (45–75 s)
4. **How to leave it** — shutdown, reset, clean (10 s)
5. **Who to ask** (5 s)

## Wiring a video into the QR system

Once a short is uploaded, edit `docs/assets/qr_registry.csv` — set `qr_payload` to the
YouTube URL for that `label_id`. The page renderer picks up the change and labels it
`[Video]` automatically. The printed QR codes do not need to be reprinted **if** they point
at the tutorial page rather than at the payload URL — **confirm which before changing any
payload**, since replacing a page URL with a video URL for an already-printed code changes
where that physical code lands.

Best of both: keep the QR pointing at the instrument's tutorial page and **embed the video
at the top of that page**. The scan then reaches the video *and* the written procedure, the
quiz, and the certification link. Recommended for every instrument that has a real page.
