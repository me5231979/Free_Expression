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

### Added by the program owner (not in the outline)

- **Free expression applies to faculty, students, and staff**, and staff help
  ensure an environment of free expression for all three (Lesson 2 Free
  Expression tab, Lesson 3, role drill, print summary).
- **Staff abide by institutional neutrality in their role** (Lesson 3, role
  drill, glossary, objective 3, narration). The definition used is
  Vanderbilt's public wording: leadership refrains from commenting on
  political matters unless they directly affect the university's core purpose
  of transformative education and pathbreaking research; reaffirmed by the
  Board of Trust in October 2024. Sources: news coverage of the Chancellor's
  statement (for example https://wjla.com/news/nation-world/vanderbilt-university-responds-to-trumps-education-proposal-emphasizing-institutional-neutrality-compact-for-academic-excellence-in-higher-education-nashville-tennessee-admissions-womens-sports-free-speech-student-discipline-affordability)
  and Times Higher Education
  (https://www.timeshighereducation.com/talking-leadership/vanderbilt-chancellor-defends-institutional-neutrality-doctrine).
  Confirm against Vanderbilt's own statement and link it in Resources.

## Course map

| Page | Key | Outline section | Activity (tracked) |
| --- | --- | --- | --- |
| Cover | `home` | | |
| What you will learn | `objectives` | Training purpose, learning objectives | Objectives mapped to the activity that checks each |
| Keep the conditions for inquiry | `why` | I | Open three moments (1870s, 1960s, Today), then one check |
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

About 1,650 words on screen across 13 pages, about 750 words of narration,
about 30 graded decisions.

## Learning objectives (measurable)

The outline's objectives were reworded with observable verbs so each one is
checked by an activity. The program owner should approve the wording.

| # | Objective | Outline wording it replaces | Measured by |
| --- | --- | --- | --- |
| 1 | **Explain** why free expression is central to Vanderbilt's academic mission. | Same | Lesson 1 check |
| 2 | **Distinguish** among free expression, open forums, and civil discourse. | Same | Lesson 2, three checks |
| 3 | **Identify** behaviors staff can model to foster constructive dialogue and intellectual openness. | "Identify ways staff can foster..." | Lesson 3, staff should model |
| 4 | **Classify** rules as limits on time, place, or manner, and describe how these limits allow expression while protecting the rights of others and the university's ability to carry out its mission. | "Understand how time, place, and manner rules..." | Lesson 4, three checks |
| 5 | **Match** demonstrations, protests, counterprotests, and dissent to their definitions, and **determine** which activities may occur during a protest of an ongoing event. | "Recognize the basic expectations governing..." | Lesson 4, definitions; during a protest |
| 6 | **Select** the response that best reflects Vanderbilt's approach in situations staff may encounter. | "Apply these principles to situations..." | Lesson 5, three scenarios |
| 7 | **Describe** one way you will model or strengthen Vanderbilt's commitment to free expression and civil discourse in your role. | New; from outline VIII (reflection) | Lesson 6, your one move |

The five-question check covers objectives 2, 4, 5, and 6 (four of five to pass).

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

ElevenLabs voice `kJKMPwrIKzwVkMKOfRtr`
(https://elevenlabs.io/voices/kJKMPwrIKzwVkMKOfRtr), model
`eleven_multilingual_v2`, settings in `.github/tts.json`, levelled to -16 LUFS.
13 clips, one per page, about 5,400 characters.

1. Add the `ELEVENLABS_API_KEY` repository secret (Settings > Secrets and
   variables > Actions). The key needs the Text to Speech permission.
2. Run **Record narration with ElevenLabs** from the Actions tab. It also runs
   on any push to `main` that changes `narration-scripts.js` or `.github/tts.json`.
3. It writes `assets/audio/fe/<page>-1.mp3` (raw files in `source/`), commits
   them, and publishes to `gh-pages`. Only changed clips are re-recorded.

`config.js` has `audio: true`: the Listen button plays the recorded clip, and
falls back to the browser's own voice for any clip not recorded yet. After
re-recording, bump `mediaVersion` in `config.js`.

## Accessibility and test record

Last run 2026-10-07, Chromium (Playwright), after the outline-only rebuild:

- axe-core 4 (WCAG 2.0 / 2.1 / 2.2 A and AA) on all 13 pages, details open,
  at 1440x900 and 320x640: **0 violations**. Automated only; no manual
  screen reader pass yet.
- No horizontal scroll at 320px on any page.
- Every activity round-trips; progress reaches 10/10 and the completion
  dialog opens; console clean.
- Keyboard: the principle and time / place / manner tabs use arrow keys, the
  practice questions are a radio group, the completion dialog traps focus
  and closes on Escape. Motion stops under `prefers-reduced-motion`.
- No em or en dashes in any file.
