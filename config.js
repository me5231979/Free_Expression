/* ══════════ FREE EXPRESSION AT VANDERBILT · settings ══════════
   The one place to change links without touching the course.
   Every URL below should be confirmed by the program owner before launch. */
window.FE_CONFIG = {
  contact: 'pcb@vanderbilt.edu',
  /* the escalation pathway from section VI of the outline. Until it is set,
     the course shows a clearly marked placeholder. */
  escalation: {
    name: '',      /* e.g. 'Office of the Dean of Students' */
    phone: '',     /* e.g. '615-000-0000' */
    email: '',     /* e.g. 'someone@vanderbilt.edu' */
    note: ''       /* one line on when to call, e.g. 'If an event cannot continue, or anyone is at risk.' */
  },
  /* end-of-course rating and comment (Kirkpatrick L1). Empty hides the button. */
  surveyUrl: '',
  links: {
    freedomOfExpression: 'https://studenthandbook.vanderbilt.edu/node/882',
    useOfSpace: 'https://studenthandbook.vanderbilt.edu/node/954',
    noise: 'https://studenthandbook.vanderbilt.edu/excessive-noise-amplified-sound',
    installations: 'https://studenthandbook.vanderbilt.edu/node/954',
    principles: 'https://www.vanderbilt.edu/principles/statement-of-principles/',
    creed: 'https://studenthandbook.vanderbilt.edu/the-vanderbilt-community-creed',
    dialogue: 'https://www.vanderbilt.edu/dialogue-vanderbilt/'
  },
  /* narration: recorded MP3s live in assets/audio/fe/<key>.mp3. Until they
     are recorded, false makes the Listen button use the browser's own voice. */
  audio: false,
  /* where Exit goes; empty closes the tab (inside an LMS) or returns to the start */
  exitUrl: '',
  mediaVersion: '20261007b'
};
