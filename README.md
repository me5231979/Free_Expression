# Free Expression at Vanderbilt

A self-paced staff training from People, Culture and Belonging, built from
the *Free Expression at Vanderbilt: Draft Outline* (proposed PCB online staff
training). Six lessons, about twenty minutes, one idea per page, with a
Listen button on every page. Built on the **Vanderbilt Voyage Online** engine
(`me5231979/Voyage_Online`) in the Vanderbilt brand, so it looks and behaves
like Voyage.

## Live site

https://me5231979.github.io/Free_Expression/ (GitHub Pages, served from the
`gh-pages` branch, a mirror of `main`). Publish with
`git branch -f gh-pages main && git push -f origin gh-pages`.

A personal greeting: add `?name=First` to the link.

## Content rule

**Outline only.** Every definition, list, myth, reality, scenario, quiz
explanation, and narration line comes from the *Free Expression at
Vanderbilt: Draft Outline*. No examples are invented. Wrong answer choices
are built from the outline's own lists (for example, a time rule offered as
the answer to a manner question) or from its myths. The only original words
are headlines, activity instructions, and wrong-answer distractors.

## Course map

| Page | Key | Outline section | Activity (tracked) |
| --- | --- | --- | --- |
| Welcome | `home` | Purpose, objectives | |
| Keep the conditions for inquiry | `why` | I | Open three moments (1870s, 1960s, Today) |
| Three principles, one community | `principles` | II.A to II.C | Three tabs, one check each; optional reflection |
| Not agreement. Conditions | `role` | III | Staff should model: three pairs |
| Five myths, five realities | `myths` | IV | Call it, then flip five cards |
| Ask the right question | `question` | V, basic principle | Match the four definitions |
| When, where, and how | `tpm` | V, time / place / manner | Three tabs, one check each |
| Both rights, at the same time | `context` | V, context; planning | May it occur during a protest? (six) |
| Conduct, not viewpoint | `staffrole` | VI, VII | The three scenarios; escalation box |
| Five questions | `quiz` | | Knowledge check, four of five |
| Your one move | `practice` | VIII | Pick a question, commit to one move |
| A culture to sustain | `learn` | V policies, IX, closing | Resources, policies, glossary, print, exit |

About 1,480 words on screen across 12 pages, about 750 words of narration,
about 30 graded decisions.

## Before launch: confirm in `config.js` and with the program owner

- **Escalation pathway.** The outline says *[Insert appropriate
  contact/protocol]*. Until `escalation.name` is set, the staff-role page and
  the printout show "To be confirmed."
- **Policy links.** Freedom of Expression and Use of University Space point to
  Student Handbook node URLs found by search; confirm the canonical links.
  The Installations link reuses Use of University Space.
- **The 1960s moment** is the outline's one line ("Vanderbilt during the
  Civil Rights Movement"). Add detail only if the program owner supplies it.
- **Policy facts** (48 hours, three and 7.5 hours, overnight, the list of
  places) are as written in the outline; confirm against the current policy.
- **Open questions for Legal and HR** (not in the outline, so not in the
  course): whether to say that some speech is not protected (the Statement of
  Principles names threats, harassment, and others), and whether staff's own
  expression is in scope.
- **The Chancellor's charge.** The VU course-builder standard calls for the
  verbatim `mission` section; its text was not available in this build.
- **Rating survey** (`surveyUrl`) and **exit URL** (`exitUrl`), if wanted.

## Files

- `index.html`: the course. `pager.js` turns it into a book (`#p/<key>/<n>`).
- `app.js`: narration, progress (localStorage `fe1-*`, nothing sent anywhere), and every activity; all activity content sits in its data arrays (`TABSETS`, `DRILLS`, `MYTHS`, `SCENARIOS`, `QUIZ`).
- `narration-scripts.js`: the words for every clip (`window.FE_NARR`).
- `config.js`: links, escalation contact, survey, exit.
- `assets/css/course.css`, `foundation.css`, `voyage.css`, `nav.css`: the Voyage design layer, unchanged; `fe.css`: this course's components.

## Narration

`config.js` has `audio: false`, so Listen reads each page with the browser's
own voice. To record real narration, copy Voyage Online's ElevenLabs workflow
(`.github/workflows/build-tts.yml`, `scripts/build-tts.py`), point it at
`window.FE_NARR` and `assets/audio/fe/`, then set `audio: true`.

## Accessibility and test record

Last run 2026-10-07, Chromium (Playwright), after the outline-only rebuild:

- axe-core 4 (WCAG 2.0 / 2.1 / 2.2 A and AA) on all 12 pages, details open,
  at 1440x900 and 320x640: **0 violations**. Automated only; no manual
  screen reader pass yet.
- No horizontal scroll at 320px on any page.
- Every activity round-trips; progress reaches 10/10 and the completion
  dialog opens; console clean.
- Keyboard: the principle and time / place / manner tabs use arrow keys, the
  practice questions are a radio group, the completion dialog traps focus
  and closes on Escape. Motion stops under `prefers-reduced-motion`.
- No em or en dashes in any file.
