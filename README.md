# Free Expression at Vanderbilt

A self-paced staff training from People, Culture and Belonging, built from
the *Free Expression at Vanderbilt: Draft Outline* (proposed PCB online staff
training). Six lessons, about thirty minutes, one idea per page, every page
narrated. Built on the **Vanderbilt Voyage Online** engine
(`me5231979/Voyage_Online`) in the Vanderbilt brand, so it looks and behaves
like Voyage.

## Live site

https://me5231979.github.io/Free_Expression/ (GitHub Pages, served from the
`gh-pages` branch, a mirror of `main`). Publish with
`git branch -f gh-pages main && git push -f origin gh-pages`.

A personal greeting: add `?name=First` to the link.

## Course map

| Page | Key | Outline section | Activity (tracked) |
| --- | --- | --- | --- |
| Welcome | `home` | Purpose, objectives | |
| An old habit of open debate | `tradition` | I | Five-moment timeline (1873, 1967, 2023, 2024, 2026) |
| Keep the conditions for inquiry | `commitment` | I, purpose | Open the three principles |
| Protect is not endorse | `expression` | II.A | Protecting or endorsing, four moments |
| Ideas need a room | `forums` | II.B | Tap the forums you support, save a reflection |
| Disagree, well | `civil` | II.C | Sort eight cards: habit, or not required |
| Not agreement. Conditions | `role` | III | Five "model this" moments |
| Five myths, five realities | `myths` | IV | Call it, then flip five cards |
| Ask the right question | `question` | V, basic principle | Name the four kinds of expression |
| When, where, and how | `tpm` | V, time / place / manner | Three tabs, one check each |
| Both rights, at the same time | `context` | V, context; planning | Generally fine, or crosses the line (six) |
| Know where to look | `policies` | V, related policies | Match four requests to a policy |
| Conduct, not viewpoint | `staffrole` | VI | Viewpoint or conduct (six), escalation box |
| Three moments, one event | `scenarios` | VII | The three scenarios, with consequences |
| Five questions | `quiz` | | Knowledge check, four of five |
| Your one move | `practice` | VIII | Pick a question, write and commit to one move |
| A culture to sustain | `learn` | IX, closing | Resources, glossary, print, exit |

Policy language (definitions, time / place / manner lists, myths and
realities, the staff role, scenarios, resources, closing) is kept verbatim
from the outline. Kirkpatrick: L1 an optional rating link (`surveyUrl`), L2
the activities and the five-question check, L3 the committed move and the
message to the team.

## Before launch: confirm in `config.js`

- **Escalation pathway.** The outline says *[Insert appropriate
  contact/protocol]*. Until `escalation.name` is set, the staff-role page and
  the printout show a clearly marked "To be confirmed" placeholder.
- **Policy links.** Freedom of Expression and Use of University Space point to
  Student Handbook node URLs found by search; confirm the canonical links.
  The Installations link currently reuses Use of University Space.
- **History.** The 1967 Impact Symposium and the 2023, 2024, and 2026 moments
  were added to illustrate the outline's "1960s" and "Today" bullets. Have
  the program owner confirm the wording.
- **The Chancellor's charge.** The VU course-builder standard calls for the
  verbatim `mission` section; its reference text was not available in this
  build, so it is not included yet.
- **Rating survey** (`surveyUrl`) and **exit URL** (`exitUrl`), if wanted.

## Files

- `index.html`: the course. `pager.js` turns it into a book (`#p/<key>/<n>`).
- `app.js`: narration, progress (localStorage `fe1-*`, nothing sent anywhere), and every activity.
- `narration-scripts.js`: the words for every clip (`window.FE_NARR`).
- `config.js`: links, escalation contact, survey, exit.
- `assets/css/course.css`, `foundation.css`, `voyage.css`, `nav.css`: the Voyage design layer, unchanged; `fe.css`: this course's components.

## Narration

`config.js` has `audio: false`, so Listen reads each page with the browser's
own voice. To record real narration, copy Voyage Online's ElevenLabs workflow
(`.github/workflows/build-tts.yml`, `scripts/build-tts.py`), point it at
`window.FE_NARR` and `assets/audio/fe/`, then set `audio: true`.

## Accessibility and test record

Last run 2026-10-07, Chromium (Playwright):

- axe-core 4 (WCAG 2.0 / 2.1 / 2.2 A and AA) on all 17 pages, details open,
  at 1440x900 and 320x640: **0 violations**.
- No horizontal scroll at 320px on any page.
- Every activity round-trips; progress reaches 15/15 and the completion
  dialog opens; console clean.
- Keyboard: timeline and time / place / manner tabs use arrow keys, the
  practice questions are a radio group, the completion dialog traps focus
  and closes on Escape. Motion stops under `prefers-reduced-motion`.
- No em or en dashes in any file.
