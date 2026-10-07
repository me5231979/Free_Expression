/* ══════════ FREE EXPRESSION AT VANDERBILT · app engine ══════════
   Built on the Vanderbilt Voyage Online engine (me5231979/Voyage_Online,
   app.js): the same narration layer, progress rail, one-at-a-time drills,
   your-call scenarios, and knowledge check, with this course's content
   and a few new modules (myth cards, tabbed principles with checks,
   reflections). Ten tracked activities. State: localStorage fe1-* in
   this browser. Nothing is sent anywhere. No em or en dashes. */
(function(){
'use strict';
var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var C = window.FE_CONFIG || {};
var yr = document.getElementById('yr'); if(yr) yr.textContent = new Date().getFullYear();
function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]; }); }
function $(s, c){ return (c || document).querySelector(s); }
function $$(s, c){ return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

/* ── storage ── */
var KEY = 'fe1-';
var mem = {};
var store = (function(){ try{ var t = KEY + 'test'; window.localStorage.setItem(t, '1'); window.localStorage.removeItem(t); return window.localStorage; }catch(e){ return null; } })();
function get(k){ if(store){ try{ var v = store.getItem(KEY + k); if(v !== null) return v; }catch(e){} } return mem[k] === undefined ? null : mem[k]; }
function set(k, v){ mem[k] = v; if(store){ try{ v === null ? store.removeItem(KEY + k) : store.setItem(KEY + k, v); }catch(e){} } }

/* ── links the program owner confirms in config.js ── */
(function(){
  var L = C.links || {};
  function put(sel, url){ if(!url) return; $$(sel).forEach(function(a){ a.href = url; }); }
  put('.lk-foe', L.freedomOfExpression); put('.lk-space', L.useOfSpace); put('.lk-noise', L.noise); put('.lk-install', L.installations);
  put('.lk-principles', L.principles); put('.lk-creed', L.creed); put('.lk-dialogue', L.dialogue); put('.lk-conversations', L.conversations);
  if(C.surveyUrl){ $$('[data-survey]').forEach(function(a){ a.href = C.surveyUrl; a.hidden = false; }); }
  if(C.contact){ var n = $('#navPcb'); if(n) n.href = 'mailto:' + C.contact; }
  /* the escalation pathway (outline section VI): a marked placeholder until config.js names it */
  var E = C.escalation || {}, et = $('#escText');
  if(et && E.name){
    et.innerHTML = '<b>' + esc(E.name) + '</b>' + (E.phone ? ' &middot; <a href="tel:' + esc(E.phone.replace(/[^0-9+]/g, '')) + '">' + esc(E.phone) + '</a>' : '') +
      (E.email ? ' &middot; <a href="mailto:' + esc(E.email) + '">' + esc(E.email) + '</a>' : '') + (E.note ? '<br>' + esc(E.note) : '');
    $('#escBox').classList.add('set');
  }
})();

/* ── greeting from the URL (?name=), for a personal welcome ── */
(function(){
  var name = '';
  try{ var q = new URLSearchParams(location.search); if(q.get('name')) name = String(q.get('name')).trim().split(/\s+/)[0]; }catch(e){}
  var h = $('#heroHello'); if(h && name) h.textContent = 'Welcome, ' + name + '. ' + h.textContent;
})();

var nav = $('#nav');
function navShade(idx){ if(nav) nav.classList.toggle('scrolled', idx > 0); }
document.addEventListener('chart:page', function(ev){ navShade(ev.detail ? ev.detail.index : 0); });
if(window.chartPager) navShade(window.chartPager.current().index);

/* ══════════ NARRATION: Listen (this page) and Auto (every page) ══════════
   Plays ./assets/audio/fe/<key>.mp3, recorded from the exact words in
   narration-scripts.js. If the file is missing (or blocked inside an LMS),
   the browser's own speech synthesis reads the same words. */
var NARR = window.FE_NARR || {};
var narr = { audio:null, playing:false, key:'', auto: get('auto') === '1', on: get('auto') === '1', utter:null };
var narrPos = (function(){ try{ var v = JSON.parse(get('narrpos') || '{}'); return v && typeof v === 'object' ? v : {}; }catch(e){ return {}; } })();
function narrPosSave(){ try{ set('narrpos', JSON.stringify(narrPos)); }catch(e){} }
function narrRemember(){
  if(!narr.audio || !narr.key) return;
  var a = narr.audio, t = a.currentTime || 0;
  if(t > 2 && (!a.duration || !isFinite(a.duration) || t < a.duration - 2)) narrPos[narr.key] = Math.max(0, t - 0.6);
  else delete narrPos[narr.key];
  narrPosSave();
}
var bbListen = $('#bbListen'), bbListenT = $('#bbListenT'), bbAuto = $('#bbAuto'), narrToast = $('#narrToast'), toastT = null;
function toast(msg){
  if(!narrToast) return;
  narrToast.textContent = msg; narrToast.classList.add('show');
  if(toastT) window.clearTimeout(toastT);
  toastT = window.setTimeout(function(){ narrToast.classList.remove('show'); }, 2800);
}
function narrKey(){ var c = window.chartPager ? window.chartPager.current() : { key:'home', n:1 }; return c.key + '/' + (c.n || 1); }
function narrUI(){
  if(bbListen){
    bbListen.setAttribute('aria-pressed', narr.playing ? 'true' : 'false');
    bbListen.classList.toggle('playing', narr.playing);
    var backAt = !narr.playing && narrPos[narrKey()] > 0;
    var lab = narr.playing ? 'Stop narration' : backAt ? 'Resume narration where it stopped' : 'Listen to this page';
    bbListen.setAttribute('aria-label', lab); bbListen.setAttribute('title', lab);
    if(bbListenT) bbListenT.textContent = narr.playing ? 'Stop' : backAt ? 'Resume' : 'Listen';
  }
  if(bbAuto) bbAuto.setAttribute('aria-pressed', narr.auto ? 'true' : 'false');
  $$('[data-narr]').forEach(function(b){ var on = narr.playing && narr.key === b.getAttribute('data-narr'); b.classList.toggle('playing', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); b.setAttribute('aria-label', on ? 'Stop' : 'Listen to this one'); });
  $$('[data-nk]').forEach(function(c){ c.classList.toggle('playing', narr.playing && narr.key === c.getAttribute('data-nk')); });
}
function narrStop(){
  if(narr.audio){ try{ narrRemember(); narr.audio.pause(); narr.audio.src = ''; }catch(e){} narr.audio = null; }
  if(window.speechSynthesis){ try{ window.speechSynthesis.cancel(); }catch(e){} }
  narr.utter = null; narr.playing = false; narrUI();
}
function narrSpeak(text){
  if(!window.speechSynthesis || !window.SpeechSynthesisUtterance){ narr.playing = false; narrUI(); toast('Narration is not available in this browser.'); return; }
  try{
    var u = new SpeechSynthesisUtterance(text);
    u.rate = 1; u.pitch = 1; u.lang = 'en-US';
    var voices = window.speechSynthesis.getVoices ? window.speechSynthesis.getVoices() : [];
    var pick = voices.filter(function(v){ return /^en(-|_)?(US|GB)?/i.test(v.lang) && /Google|Samantha|Karen|Daniel|Serena|Zira|Aria|Natural/i.test(v.name); })[0] || voices.filter(function(v){ return /^en/i.test(v.lang); })[0];
    if(pick) u.voice = pick;
    u.onend = function(){ if(narr.utter === u){ narr.utter = null; narr.playing = false; narrUI(); } };
    u.onerror = function(){ if(narr.utter === u){ narr.utter = null; narr.playing = false; narrUI(); } };
    narr.utter = u; narr.playing = true; narrUI();
    window.speechSynthesis.cancel(); window.speechSynthesis.speak(u);
  }catch(e){ narr.playing = false; narrUI(); }
}
/* bumped whenever a clip is re-recorded, so browsers fetch the new file */
var MEDIA_V = C.mediaVersion || '1';
function textHash(t){ var h = 5381; for(var i = 0; i < t.length; i++){ h = ((h << 5) + h + t.charCodeAt(i)) | 0; } return (h >>> 0).toString(36); }
function pauseVideos(){
  $$('video').forEach(function(v){ if(v.id !== 'heroVideo' && !v.paused){ try{ v.pause(); }catch(e){} } });
  /* hosted players (Vimeo) pause through their postMessage API */
  $$('.v-video iframe').forEach(function(f){ try{ f.contentWindow.postMessage(JSON.stringify({ method:'pause' }), 'https://player.vimeo.com'); }catch(e){} });
}
/* a video starting, from our play button or the player's own controls, stops the narration */
window.addEventListener('message', function(e){
  if(!/^https:\/\/player\.vimeo\.com$/.test(e.origin)) return;
  var d = e.data; if(typeof d === 'string'){ try{ d = JSON.parse(d); }catch(err){ return; } }
  if(!d || !d.event) return;
  if(d.event === 'ready'){ ['play', 'playing'].forEach(function(ev){ try{ e.source.postMessage(JSON.stringify({ method:'addEventListener', value:ev }), e.origin); }catch(err){} }); }
  else if(d.event === 'play' || d.event === 'playing'){ if(narr.playing) narrStop(); }
});
function narrPlay(k){
  k = k || narrKey(); var text = NARR[k];
  narrStop(); pauseVideos();
  if(!text){ toast('No narration on this page.'); return; }
  narr.key = k; narr.playing = true; narrUI();
  /* no recorded clips yet (config.js audio:false): the browser's own voice reads the script */
  if(C.audio === false){ narrSpeak(text); return; }
  /* the version carries a hash of the script, so a re-recorded clip is never served from an old cache */
  var a = new Audio('./assets/audio/fe/' + k.replace(/\//g, '-') + '.mp3?v=' + MEDIA_V + '-' + textHash(text));
  a.preload = 'auto';
  a.addEventListener('ended', function(){ if(narr.audio === a){ narr.audio = null; narr.playing = false; delete narrPos[k]; narrPosSave(); narrUI(); } });
  a.addEventListener('error', function(){ if(narr.audio === a){ narr.audio = null; narrSpeak(text); } });
  narr.audio = a;
  var backTo = narrPos[k] || 0;
  if(backTo > 0){
    var seek = function(){ try{ if(narr.audio === a && (!a.duration || !isFinite(a.duration) || backTo < a.duration - 1)) a.currentTime = backTo; }catch(e){} };
    if(a.readyState >= 1) seek(); else a.addEventListener('loadedmetadata', seek);
  }
  var pr = a.play();
  if(pr && pr.catch) pr.catch(function(err){
    if(narr.audio !== a) return;
    narr.audio = null;
    if(err && err.name === 'NotAllowedError'){
      narr.playing = false; narrUI();
      /* the browser will not play sound before the first tap: start on that tap, without nagging */
      if(narr.auto && !narr.armed){ narr.armed = true; var arm = function(){ narr.armed = false; document.removeEventListener('pointerdown', arm, true); document.removeEventListener('keydown', arm, true); window.setTimeout(function(){ if(narr.auto && !narr.playing) narrPlay(); }, 350); }; document.addEventListener('pointerdown', arm, true); document.addEventListener('keydown', arm, true); }
      else if(!narr.auto) toast('Tap Listen to hear this page.');
    }
    else narrSpeak(text);
  });
}
if(bbListen) bbListen.addEventListener('click', function(){ if(narr.playing){ narr.on = false; narrStop(); } else { narr.on = true; narrPlay(); } });
/* a tab, card, or situation with its own clip plays when opened (if the learner is listening), or when its speaker is tapped */
function narrSub(k, force){
  if(!NARR[k]){ if(force) toast('No narration for this one.'); else if(narr.playing) narrStop(); return; }
  delete narrPos[k]; narrPosSave();
  if(force) narr.on = true;
  if(narr.on || narr.auto) narrPlay(k); else if(narr.playing) narrStop();
}
function subBtn(k){ return NARR[k] ? '<button type="button" class="sub-listen" data-narr="' + k + '" aria-pressed="false" aria-label="Listen to this one" title="Listen to this one"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path class="w1" d="M15.5 8.5a5 5 0 0 1 0 7"/><path class="w2" d="M19 5a9 9 0 0 1 0 14"/></svg></button>' : ''; }
document.addEventListener('click', function(e){
  var b = e.target.closest('[data-narr]'); if(b){ e.preventDefault(); narrSub(b.getAttribute('data-narr'), true); return; }
  /* clicking into an activity stops whatever is playing, so the audio never talks over the learner */
  if(e.target.closest('.scn button[data-o], [data-drill] button, .kq button, .fe-tpm .dq-opts button, .fe-myth button, .v-commits button')){ pauseVideos(); if(narr.playing) narrStop(); }
}, true);
if(bbAuto) bbAuto.addEventListener('click', function(){
  narr.auto = !narr.auto; narr.on = narr.auto; set('auto', narr.auto ? '1' : '0'); narrUI();
  if(narr.auto){ toast('Auto-narration on. Each page is read as it turns.'); narrPlay(); }
  else { toast('Auto-narration off.'); narrStop(); }
});
document.addEventListener('chart:page', function(){ narrStop(); delete narrPos[narrKey()]; narrPosSave(); narrUI(); if(narr.auto) window.setTimeout(narrPlay, reduce ? 0 : 380); });
var progFill = $('#progFill');
function pageLine(){ if(!progFill || !window.chartPager) return; var c = window.chartPager.current(), n = window.chartPager.count || 1; progFill.style.width = ((c.index + 1) / n * 100) + '%'; }
document.addEventListener('chart:page', pageLine); window.setTimeout(pageLine, 50);
document.addEventListener('visibilitychange', function(){ if(document.hidden && narr.playing) narrStop(); });
narrUI();
if(narr.auto) window.setTimeout(narrPlay, 600);

/* ══════════ PROGRESS ══════════ */
var SECTIONS = [
  { k:'why',        no:'01', name:'Why free expression matters', how:'Open three moments and answer the check' },
  { k:'principles', no:'02', name:'The three core principles',   how:'Open each one and answer its check' },
  { k:'role',       no:'03', name:'Our responsibility as staff', how:'Pick what staff should model' },
  { k:'myths',      no:'04', name:'Myths and realities',         how:'Flip all five cards' },
  { k:'question',   no:'05', name:'Four kinds of expression',    how:'Match all four definitions' },
  { k:'tpm',        no:'06', name:'Time, place, and manner',     how:'Answer all three checks' },
  { k:'context',    no:'07', name:'Why context matters',         how:'Six calls during a protest' },
  { k:'staffrole',  no:'08', name:'Check your understanding',    how:'Answer all three scenarios' },
  { k:'quiz',       no:'09', name:'A quick check',               how:'Score 4 of 5' },
  { k:'practice',   no:'10', name:'From principle to practice',  how:'Pick a question and commit to one move' }
];
function progIs(k){ return get('p-' + k) === '1'; }
function progWrite(k, v){ set('p-' + k, v ? '1' : null); }
var progList = $('#progList'), progCount = $('#progCount'), progSum = $('#progSum'), progStatus = $('#progStatus'),
    progBtn = $('#progBtn'), progPanel = $('#progPanel');
if(progList) progList.innerHTML = SECTIONS.map(function(s){
  return '<li data-prog-row="' + s.k + '"><a href="#p/' + s.k + '/1"><span class="p-no" aria-hidden="true">' + s.no + '</span>' +
    '<span class="p-name">' + s.name + '<span class="p-how">' + s.how + '</span></span></a>' +
    '<button type="button" class="p-state" data-prog="' + s.k + '" aria-pressed="false" aria-label="Mark ' + s.name + ' done">Mark done</button></li>';
}).join('');
function progRender(changedKey, nowDone){
  var total = SECTIONS.length, doneN = 0;
  SECTIONS.forEach(function(s){ if(progIs(s.k)) doneN++; });
  var left = total - doneN;
  if(progCount) progCount.textContent = doneN + '/' + total;
  if(progSum) progSum.textContent = doneN === total ? 'All ' + total + ' activities complete.' : doneN + ' of ' + total + ' activities complete. ' + left + ' left; each row is a shortcut.';
  SECTIONS.forEach(function(s){
    var done = progIs(s.k);
    var row = progList ? progList.querySelector('[data-prog-row="' + s.k + '"]') : null;
    if(row){
      row.classList.toggle('done', done);
      var st = row.querySelector('.p-state');
      if(st){ st.textContent = done ? 'Completed' : 'Mark done'; st.setAttribute('aria-pressed', done ? 'true' : 'false'); st.setAttribute('aria-label', done ? s.name + ' completed. Select to un-mark.' : 'Mark ' + s.name + ' done'); }
    }
    var dot = $('.bb-dot[data-rail="' + s.k + '"]');
    if(dot){ dot.classList.toggle('done', done); var base = dot.getAttribute('data-name') || s.name; dot.setAttribute('aria-label', base + ', activity ' + (done ? 'done' : 'not done')); dot.setAttribute('title', base + ' · ' + (done ? 'done' : 'not yet')); }
  });
  if(changedKey && progStatus){ var sec = SECTIONS.filter(function(s){ return s.k === changedKey; })[0]; if(sec) progStatus.textContent = (nowDone ? 'Activity complete: ' : 'Activity reopened: ') + sec.name + '. ' + doneN + ' of ' + total + ' complete.'; }
  bbDoneSync();
  if(doneN === total) allDone();
}
var bbDoneBtn = $('#bbDone');
function bbDoneSync(){
  if(!bbDoneBtn) return;
  var curKey = (window.chartPager && window.chartPager.current) ? window.chartPager.current().key : '';
  var sec = SECTIONS.filter(function(s){ return s.k === curKey; })[0];
  if(!sec){ bbDoneBtn.hidden = true; bbDoneBtn.removeAttribute('data-prog'); return; }
  var done = progIs(sec.k);
  bbDoneBtn.hidden = false;
  bbDoneBtn.setAttribute('data-prog', sec.k);
  bbDoneBtn.setAttribute('aria-pressed', done ? 'true' : 'false');
  bbDoneBtn.setAttribute('aria-label', done ? sec.name + ' completed. Select to un-mark.' : 'Mark done: ' + sec.name);
  var t = bbDoneBtn.querySelector('.bb-done-t'); if(t) t.textContent = done ? 'Completed' : 'Mark done';
}
if(bbDoneBtn) bbDoneBtn.addEventListener('click', function(){ var k = bbDoneBtn.getAttribute('data-prog'); if(k) progToggle(k); });
document.addEventListener('chart:page', bbDoneSync);
function progDone(k){ if(progIs(k)) return; progWrite(k, true); progRender(k, true); turnDone(k); }
function progToggle(k){ var v = !progIs(k); progWrite(k, v); progRender(k, v); if(v) turnDone(k); else untask(k); }
function progOpen(open){ if(!progPanel || !progBtn) return; progPanel.hidden = !open; progBtn.setAttribute('aria-expanded', open ? 'true' : 'false'); }
if(progBtn) progBtn.addEventListener('click', function(){ progOpen(progPanel && progPanel.hidden); });
if(progPanel) progPanel.addEventListener('click', function(e){
  var st = e.target.closest ? e.target.closest('button.p-state') : null;
  if(st){ progToggle(st.getAttribute('data-prog')); return; }
  if(e.target.closest('a')) progOpen(false);
});
document.addEventListener('click', function(e){ if(progPanel && !progPanel.hidden && !e.target.closest('#progPanel') && !e.target.closest('#progBtn')) progOpen(false); });
document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && progPanel && !progPanel.hidden){ progOpen(false); if(progBtn) progBtn.focus(); } });
var progReset = $('#progReset');
if(progReset) progReset.addEventListener('click', function(){
  /* everything this course saved: progress, answers, reflections, narration spots */
  mem = {};
  if(store){ try{ Object.keys(store).forEach(function(k){ if(k.indexOf(KEY) === 0 && k !== KEY + 'auto') store.removeItem(k); }); store.removeItem('fe1-page'); }catch(e){} }
  doneSeen = false;
  if(progStatus) progStatus.textContent = 'Progress reset. 0 of ' + SECTIONS.length + ' activities complete.';
  window.setTimeout(function(){ location.hash = '#p/home/1'; location.reload(); }, 400);
});
if(!store){ var pw = $('#progStorageNote'); if(pw) pw.hidden = false; }

/* ══════════ task chips: the instruction above each activity turns gold with a check when done ══════════ */
function turnDone(k){ $$('.v-task[data-task="' + k + '"]').forEach(function(t){ t.classList.add('done'); }); }
function untask(k){ $$('.v-task[data-task="' + k + '"]').forEach(function(t){ t.classList.remove('done'); }); }

/* ── completion modal (fires once when every activity is done) ── */
var doneSeen = get('done-seen') === '1';
var modalReturn = null;
function allDone(){
  if(doneSeen) return;
  doneSeen = true; set('done-seen', '1');
  window.setTimeout(modalShow, reduce ? 0 : 450);
}
function modalShow(){
  var m = $('#oracleModal'); if(!m || !m.hidden) return;
  var ae = document.activeElement; modalReturn = (ae && ae !== document.body) ? ae : null;
  m.hidden = false;
  if(reduce) m.classList.add('open'); else window.requestAnimationFrame(function(){ m.classList.add('open'); });
  document.body.classList.add('oracle-open');
  var go = $('#oracleGo'); if(go) go.focus();
}
function modalHide(){
  var m = $('#oracleModal'); if(!m || m.hidden) return;
  m.classList.remove('open'); document.body.classList.remove('oracle-open');
  window.setTimeout(function(){ m.hidden = true; }, reduce ? 0 : 260);
  if(modalReturn && modalReturn.focus){ try{ modalReturn.focus(); }catch(e){} } modalReturn = null;
}
['#oracleGo'].forEach(function(s){ var b = $(s); if(b) b.addEventListener('click', modalHide); });
var oOverlay = $('#oracleModal');
if(oOverlay) oOverlay.addEventListener('click', function(e){ if(e.target === oOverlay) modalHide(); });
document.addEventListener('keydown', function(e){
  var m = $('#oracleModal'); if(!m || m.hidden) return;
  if(e.key === 'Escape'){ modalHide(); return; }
  if(e.key !== 'Tab') return;
  var items = $$('a[href], button:not([disabled])', m); if(!items.length) return;
  var first = items[0], last = items[items.length - 1], active = document.activeElement, idx = items.indexOf(active);
  if(idx === -1){ e.preventDefault(); first.focus(); }
  else if(e.shiftKey && active === first){ e.preventDefault(); last.focus(); }
  else if(!e.shiftKey && active === last){ e.preventDefault(); first.focus(); }
});


/* Every statement, definition, and explanation below comes from the
   "Free Expression at Vanderbilt: Draft Outline". Answer choices that are
   wrong are built from the outline's own lists (for example, a time rule
   offered as an answer to a manner question) or from the outline's myths.
   No examples are invented. */

/* ══════════ lesson 1: three moments open in place, then one check ══════════
   Done when all three moments are open and the check is answered. */
var whySeen = {}, whyChecked = false;
function whyMaybeDone(){ if(Object.keys(whySeen).length === 3 && whyChecked) progDone('why'); }
document.addEventListener('fe:drilldone', function(e){ if(e.detail === 'why'){ whyChecked = true; whyMaybeDone(); } });
(function(){
  var list = $('#momentList'); if(!list) return;
  $$('button', list).forEach(function(b, i){ b.addEventListener('click', function(){
    var o = b.getAttribute('aria-expanded') !== 'true'; b.setAttribute('aria-expanded', o ? 'true' : 'false');
    if(o){ whySeen[i] = 1; whyMaybeDone(); }
  }); });
})();

/* ══════════ tabs with one check each: the three principles, and time / place / manner ══════════ */
var TABSETS = {
  principles: { prog:'principles', label:'The three core principles', tabs:[
    { name:'Free Expression', lead:'The freedom to express, examine, question, and challenge ideas, including ideas that others may find disagreeable or offensive.', list:[
        'At a university, this principle is especially important to the work of students and faculty. Learning and scholarship require room to ask difficult questions, investigate competing explanations, challenge arguments, develop new ideas, and respond to the ideas of others.',
        'Vanderbilt’s Freedom of Expression policy emphasizes that when people encounter ideas contrary to their own, the response should generally be discussion, debate, and mutually respectful dialogue rather than suppression.'],
      takeH:'Key concept', take:'Protecting expression is not the same as endorsing expression. Maintaining an environment for free expression does not require Vanderbilt, or an individual staff member, to agree with those ideas.',
      q:'When people encounter ideas contrary to their own, the response should generally be...', opts:['Suppression of the idea', 'Discussion, debate, and mutually respectful dialogue', 'Agreement, to keep the peace'], a:1,
      x:'Vanderbilt’s Freedom of Expression policy emphasizes discussion, debate, and mutually respectful dialogue rather than suppression.' },
    { name:'Open Forums', lead:'Spaces and opportunities in which different ideas and perspectives can be presented, questioned, debated, and tested. Open forums can include:', list:[
        'Classroom conversations', 'Lectures and speaker programs', 'Debates', 'Student organization events', 'Dialogue programs', 'Public forums', 'Peaceful demonstrations and counterexpression', 'Informal conversations across difference'],
      takeH:'Vanderbilt in practice', take:'Dialogue Vanderbilt, 250 Conversations on America, Vanderbilt debates and speaker programs, and classroom engagement with differing perspectives.',
      reflect:'Where do we create opportunities for students to encounter different perspectives?',
      q:'Which of these can be an open forum?', opts:['Only lectures and formal debates', 'Only events planned in advance', 'Classroom conversations, peaceful demonstrations, and informal conversations across difference, among others'], a:2,
      x:'Open forums include classroom conversations, lectures and speaker programs, debates, student organization events, dialogue programs, public forums, peaceful demonstrations and counterexpression, and informal conversations across difference.' },
    { name:'Civil Discourse', lead:'Effective, respectful dialogue across difference. It provides a way to engage disagreement productively. Civil discourse does not require agreement, avoiding difficult topics, suppressing strongly held views, pretending differences do not exist, or reaching consensus.', list:[
        'Ask before assuming.', 'Listen to understand before responding.', 'Separate a person from an argument.', 'Ask questions that test ideas rather than attack people.', 'Use evidence and reasoning.', 'Acknowledge uncertainty.', 'Be willing to revise your own assumptions.', 'Make room for disagreement.', 'Remember that another person may have information or insight you do not.'],
      listH:'Habits staff can model',
      takeH:'The Community Creed', take:'Approach intellectual questions with curiosity and humility, be courageous enough to challenge assumptions, remain open to ideas and experiences, and engage others with respect.',
      q:'Which of these does civil discourse require?', opts:['Reaching consensus', 'Avoiding difficult topics', 'None of these; it is a way to engage disagreement productively'], a:2,
      x:'Civil discourse does not require agreement, avoiding difficult topics, suppressing strongly held views, pretending differences do not exist, or reaching consensus.' }
  ]},
  tpm: { prog:'tpm', label:'Time, place, and manner', tabs:[
    { name:'Time', lead:'Expression may be subject to reasonable limits on when and for how long it occurs.', list:[
        'Organizers should, when possible, submit plans for demonstrations, protests, and counterprotests at least 48 hours in advance.',
        'Expression is recommended to last no longer than three hours and may not exceed 7.5 hours.',
        'Demonstrations, protests, and counterprotests may not occur at times requiring participants to sleep or gather overnight.',
        'Noise and amplified sound are subject to separate university requirements.'],
      takeH:'Key takeaway', take:'Expression is protected, but its timing cannot prevent the university from carrying out its normal activities.',
      q:'Which of these is a limit on time?', opts:['Expression may not exceed 7.5 hours', 'Expression cannot block entrances or exits', 'Expression cannot occur in research laboratories'], a:0,
      x:'Expression is recommended to last no longer than three hours and may not exceed 7.5 hours. The other two are limits on manner and place.' },
    { name:'Place', lead:'Expression may be subject to reasonable limits on where it occurs. Demonstrations and protests cannot occur in certain spaces where expression would interfere with privacy, safety, academic activity, essential services, or the rights of others. Examples include:', list:[
        'Private offices and residences', 'Research laboratories and associated facilities', 'Classrooms or meeting spaces while classes or private meetings are occurring', 'Residential areas during quiet hours', 'Student health and wellbeing facilities', 'Vanderbilt University Medical Center and areas where access to medical services could be obstructed', 'Certain areas containing sensitive records, equipment, or materials', 'Critical university infrastructure'],
      more:'Other rules protect entrances, exits, sidewalks, pedestrian and vehicular movement, and access to university activities.',
      takeH:'Key takeaway', take:'A person’s ability to express a message does not include a right to occupy every university space for that purpose.',
      q:'Which of these is a limit on place?', opts:['Plans submitted at least 48 hours in advance', 'Not in classrooms while classes are occurring', 'Cannot cause physical harm or property damage'], a:1,
      x:'Classrooms or meeting spaces while classes or private meetings are occurring are on the list of places. The other two are limits on time and manner.' },
    { name:'Manner', lead:'Expression may also be subject to reasonable limits on how it occurs. Vanderbilt permits many forms of expressive activity, including signs, picketing, marching, symbolic expression, and, in appropriate settings, chanting and speeches. But expression cannot:', list:[
        'Block entrances or exits.', 'Prevent others from entering or participating in an event.', 'Prevent an audience from hearing or seeing a speaker.', 'Materially disrupt teaching, administration, or other authorized university activities.', 'Impede pedestrian or vehicular movement.', 'Cause physical harm or property damage.', 'Violate applicable noise and amplified-sound rules.', 'Engage in disorderly conduct or other conduct prohibited by university policy.'],
      q:'Which of these is a limit on manner?', opts:['May not gather overnight', 'Not in student health and wellbeing facilities', 'Cannot prevent an audience from hearing or seeing a speaker'], a:2,
      x:'Expression cannot prevent an audience from hearing or seeing a speaker. The other two are limits on time and place.' }
  ]}
};
function buildTabs(box){
  var name = box.getAttribute('data-tabs'), T = TABSETS[name]; if(!T) return;
  var status = $('#' + name + 'Status'), answered = {}, n = T.tabs.length, id = name;
  box.innerHTML = '<div class="fe-tabs" role="tablist" aria-label="' + esc(T.label) + '" style="grid-template-columns:repeat(' + n + ',1fr)">' + T.tabs.map(function(t, i){
      return '<button type="button" role="tab" id="' + id + 'Tab' + i + '" aria-controls="' + id + 'Panel' + i + '" aria-selected="' + (i === 0 ? 'true' : 'false') + '" tabindex="' + (i === 0 ? '0' : '-1') + '" data-t="' + i + '"><b>' + esc(t.name) + '</b><span class="fe-tab-ok" aria-hidden="true"></span></button>'; }).join('') + '</div>' +
    T.tabs.map(function(t, i){
      return '<div class="fe-panel" role="tabpanel" id="' + id + 'Panel' + i + '" aria-labelledby="' + id + 'Tab' + i + '"' + (i === 0 ? '' : ' hidden') + '><div class="fe-panel-grid"><div>' +
        '<p class="fe-lead">' + esc(t.lead) + '</p>' + (t.listH ? '<p class="v-label fe-listh">' + esc(t.listH) + '</p>' : '') +
        '<ul class="fe-list' + (t.list.length > 6 ? ' two' : '') + '">' + t.list.map(function(x){ return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' + (t.more ? '<p class="fe-small">' + esc(t.more) + '</p>' : '') +
        (t.take ? '<p class="fe-take"><span class="v-label">' + esc(t.takeH) + '</span>' + esc(t.take) + '</p>' : '') + '</div>' +
        '<div><div class="v-deck"><div class="dq cur" data-i="' + i + '"><p class="dq-s"><b>Check: ' + esc(t.name) + '</b>' + esc(t.q) + '</p><div class="dq-opts fe-stack" role="group" aria-label="Choose one">' +
          t.opts.map(function(o, oi){ return '<button type="button" data-o="' + oi + '" aria-pressed="false">' + esc(o) + '</button>'; }).join('') + '</div><p class="dq-x" role="status"></p></div></div>' +
        (t.reflect ? '<div class="fe-card fe-reflect fe-mini"><label class="v-label" for="forumReflect">Reflection (optional)</label><p class="fe-q">' + esc(t.reflect) + '</p><textarea id="forumReflect" rows="2"></textarea><div class="fe-row"><button type="button" class="btn btn-ghost btn-sm" id="forumSave">Save</button><span class="fe-saved" id="forumSaved" role="status" aria-live="polite"></span></div></div>' : '') +
      '</div></div></div>';
    }).join('');
  var tabs = $$('[role="tab"]', box), panels = $$('[role="tabpanel"]', box);
  function paint(){ var k = Object.keys(answered).length; if(status) status.textContent = k + ' of ' + n + ' answered.' + (k === n ? ' Activity complete.' : ''); if(k === n) progDone(T.prog); }
  function sel(i, focus){
    tabs.forEach(function(t, ti){ t.setAttribute('aria-selected', ti === i ? 'true' : 'false'); t.tabIndex = ti === i ? 0 : -1; });
    panels.forEach(function(p, pi){ p.hidden = pi !== i; });
    if(focus) tabs[i].focus();
  }
  box.addEventListener('click', function(e){
    var t = e.target.closest('[role="tab"]'); if(t){ sel(+t.getAttribute('data-t')); return; }
    var b = e.target.closest('.dq-opts button'); if(!b || b.disabled) return;
    var q = b.closest('.dq'), i = +q.getAttribute('data-i'), it = T.tabs[i], oi = +b.getAttribute('data-o'), ok = oi === it.a;
    $$('button', q.querySelector('.dq-opts')).forEach(function(x){ x.disabled = true; x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); if(+x.getAttribute('data-o') === it.a) x.classList.add('is-answer'); });
    q.classList.add(ok ? 'right' : 'wrong');
    var nxt = -1; for(var j = 1; j < n; j++){ var c = (i + j) % n; if(!answered[c] && c !== i){ nxt = c; break; } }
    q.querySelector('.dq-x').innerHTML = '<b>' + (ok ? 'Right. ' : 'Not quite. The answer is: ' + esc(it.opts[it.a]) + '. ') + '</b>' + esc(it.x) + (nxt > -1 ? ' Now open ' + esc(T.tabs[nxt].name) + '.' : '');
    answered[i] = 1; tabs[i].classList.add('done');
    paint();
  });
  box.addEventListener('keydown', function(e){
    var t = e.target.closest('[role="tab"]'); if(!t) return;
    var i = +t.getAttribute('data-t'), k = null;
    if(e.key === 'ArrowRight') k = (i + 1) % n; else if(e.key === 'ArrowLeft') k = (i + n - 1) % n; else if(e.key === 'Home') k = 0; else if(e.key === 'End') k = n - 1;
    if(k === null) return; e.preventDefault(); e.stopPropagation(); sel(k, true);
  });
  paint();
}
$$('[data-tabs]').forEach(buildTabs);

/* the optional open-forums reflection (outline II.B) */
(function(){
  var ta = $('#forumReflect'), save = $('#forumSave'), saved = $('#forumSaved'); if(!ta) return;
  ta.value = get('forum-reflect') || '';
  save.addEventListener('click', function(){ var v = (ta.value || '').trim(); set('forum-reflect', v || null); saved.textContent = v ? 'Saved in this browser.' : 'Cleared.'; });
})();

/* ══════════ your call: the outline's three scenarios ══════════ */
var SCENARIOS = {
  ev1: { h:'Scenario 1 · The controversial speaker', s:'Students tell a staff member that another student group has invited a speaker whose views are offensive and ask that the event be canceled. Which response best reflects Vanderbilt’s approach?', opts:[
    { t:'Cancel the event if enough students object.', best:false, out:'Expression does not lose protection simply because it is controversial, unpopular, disagreeable, or offensive.' },
    { t:'Explain that disagreement or offense alone does not determine whether expression may occur, and discuss appropriate opportunities for dialogue or counterexpression.', best:true, out:'The best answer. Vanderbilt encourages discussion, debate, and dialogue in response to opposing ideas.' },
    { t:'Tell the students they should not object to invited speakers.', best:false, out:'Protest and counterexpression are valued forms of expression. The students may respond with expression of their own.' }
  ]},
  ev2: { h:'Scenario 2 · The protest', s:'Students stand outside an event holding signs opposing the speaker. They do not block the entrance, and attendees can enter and participate without disruption. Is the fact that the protest directly targets the event itself a policy problem?', opts:[
    { t:'Yes.', best:false, out:'Protest and counterexpression are valued forms of expression. The relevant question is whether the activity complies with university policy and allows others to access and participate in the event.' },
    { t:'No.', best:true, out:'Correct. Protest and counterexpression are valued forms of expression. The relevant question is whether the activity complies with university policy and allows others to access and participate in the event.' }
  ]},
  ev3: { h:'Scenario 3 · When protest becomes disruption', s:'During an event, protesters repeatedly shout so that the speaker cannot be heard and attendees cannot reasonably participate. What has changed?', opts:[
    { t:'The protesters’ viewpoint, or their decision to protest.', best:false, out:'The issue is no longer simply the protesters’ viewpoint or their decision to protest.' },
    { t:'Their manner of expression, which now interferes with the rights of others to participate.', best:true, out:'Correct. Their manner of expression is interfering with the rights of others to participate in the university activity, bringing Vanderbilt’s time, place, and manner rules into play.' }
  ]}
};
function buildScenario(el){
  var name = el.getAttribute('data-scn'), sc = SCENARIOS[name]; if(!sc) return;
  var tried = {}, n = sc.opts.length;
  el.innerHTML = '<p class="scn-s">' + esc(sc.s) + '</p><div class="scn-opts" role="group" aria-label="Choose your response">' +
    sc.opts.map(function(o, i){ return '<button type="button" data-o="' + i + '" aria-pressed="false"><span class="k" aria-hidden="true">' + String.fromCharCode(65 + i) + '</span><span>' + esc(o.t) + '</span></button>'; }).join('') +
    '</div><div class="scn-out" role="status" aria-live="polite"></div>';
  var out = el.querySelector('.scn-out');
  el.addEventListener('click', function(e){
    var b = e.target.closest('button[data-o]'); if(!b) return;
    var i = parseInt(b.getAttribute('data-o'), 10), o = sc.opts[i];
    tried[i] = 1;
    $$('button[data-o]', el).forEach(function(x){ x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
    if(o.best) b.classList.add('best-pick');
    out.innerHTML = '<span class="vtag' + (o.best ? ' best' : '') + '">' + (o.best ? 'Vanderbilt’s approach' : 'Not quite') + '</span><p>' + esc(o.out) + '</p>' +
      (!o.best ? '<p class="scn-again hinttxt">Try another answer.</p>' : '');
    out.classList.add('show');
  });
}
var CALL_SETS = { event:['ev1', 'ev2', 'ev3'] };
var CALL_PROG = { event:{ prog:'staffrole', noun:'scenarios', status:'#scenariosStatus', narr:'staffrole/s' } };
function buildCalls(el){
  var name = el.getAttribute('data-calls'), keys = CALL_SETS[name]; if(!keys) return;
  var cfg = CALL_PROG[name], status = $(cfg.status), found = {}, cur = 0;
  el.innerHTML = keys.map(function(k, i){
    var sc = SCENARIOS[k];
    return '<div class="cq' + (i === 0 ? ' cur' : '') + '" data-k="' + k + '"><p class="cq-h">' + esc(sc.h) + '</p><div class="scn" data-scn="' + k + '"></div><div class="cq-nav">' +
      (i < keys.length - 1 ? '<button type="button" class="btn btn-primary btn-sm" data-next="1" hidden>Next scenario' + ARROW + '</button>' : '') +
      (i > 0 ? '<button type="button" class="btn btn-ghost btn-sm" data-prev="1">Back</button>' : '') + '</div></div>';
  }).join('');
  $$('.scn[data-scn]', el).forEach(buildScenario);
  function pips(){ return '<span class="pips" aria-hidden="true">' + keys.map(function(k){ return '<i class="' + (found[k] ? 'ok' : '') + '"></i>'; }).join('') + '</span>'; }
  function paint(){ var n = Object.keys(found).length; if(status) status.innerHTML = pips() + '<span>' + n + ' of ' + keys.length + ' ' + cfg.noun + '.' + (n === keys.length ? ' Activity complete.' : '') + '</span>'; if(n === keys.length) progDone(cfg.prog); }
  function show(i){ $$('.cq', el).forEach(function(q, qi){ q.classList.toggle('cur', qi === i); }); cur = i; var f = $$('.cq', el)[i].querySelector('.scn button'); if(f) f.focus({ preventScroll:true }); }
  el.addEventListener('click', function(e){
    if(e.target.closest('button[data-next]')){ show(cur + 1); return; }
    if(e.target.closest('button[data-prev]')){ show(cur - 1); return; }
    var b = e.target.closest('.scn button[data-o]'); if(!b) return;
    var q = b.closest('.cq'), k = q.getAttribute('data-k'), o = SCENARIOS[k].opts[parseInt(b.getAttribute('data-o'), 10)];
    if(o.best){ var nx = q.querySelector('button[data-next]'); if(nx) nx.hidden = false; found[k] = 1; paint(); }
  });
  paint();
}
$$('[data-calls]').forEach(buildCalls);

/* ══════════ drills: one card at a time, feedback after each ══════════ */
var DRILLS = {
  why: { prog:null, verb:'answered', items:[
    { s:'The university’s commitment is...', opts:['Merely to allow disagreement', 'To maintain an environment in which disagreement and intellectual exploration can occur', 'To ensure every conversation is comfortable'], a:1, x:'The university’s commitment is not merely to allow disagreement, but to maintain an environment in which disagreement and intellectual exploration can occur.' }
  ]},
  role: { prog:'role', verb:'decided', items:[
    { s:'Staff should model...', opts:['Assumption', 'Curiosity'], a:1, x:'Curiosity over assumption.' },
    { s:'When facilitating dialogue, staff should model...', opts:['Questions', 'Declarations'], a:0, x:'Questions over declarations when facilitating dialogue.' },
    { s:'Staff should model...', opts:['Confrontation', 'De-escalation'], a:1, x:'De-escalation over confrontation. Staff should also model consistency in applying university rules, and respect for expression while maintaining appropriate boundaries on conduct.' }
  ]},
  types: { opts:['Demonstration', 'Protest', 'Counterprotest', 'Dissent'], prog:'question', verb:'matched', items:[
    { s:'Expression intentionally connected to another campus event or activity.', a:1, x:'A protest.' },
    { s:'A short, spontaneous, nonviolent verbal or nonverbal reaction to a speaker.', a:3, x:'Dissent. By its nature, it may occur spontaneously without advance university review.' },
    { s:'Expression independent of another campus event or activity.', a:0, x:'A demonstration.' },
    { s:'Expression responding to another organizer’s activity.', a:2, x:'A counterprotest.' }
  ]},
  context: { opts:['May occur', 'Not allowed'], prog:'context', verb:'called', items:[
    { s:'Holding signs.', a:0, x:'During protests and counterprotests, silent and symbolic activities, such as picketing, holding signs, turning backs, or covering ears, may occur.' },
    { s:'Blocking entrances or exits.', a:1, x:'Expression cannot block entrances or exits.' },
    { s:'Turning backs or covering ears.', a:0, x:'Silent and symbolic activities may occur.' },
    { s:'Preventing the audience from hearing or seeing the speaker.', a:1, x:'Expression cannot prevent an audience from hearing or seeing a speaker. Audible activity may be restricted when it would interfere with the targeted event.' },
    { s:'Picketing.', a:0, x:'Picketing is a silent and symbolic activity that may occur.' },
    { s:'Preventing others from entering or participating in the event.', a:1, x:'Expression cannot prevent others from entering or participating in an event.' }
  ]}
};
function buildDrill(el){
  var name = el.getAttribute('data-drill'), d = DRILLS[name]; if(!d) return;
  var status = $('#' + name + 'Status'), done = {}, cur = 0, right = 0;
  el.innerHTML = d.items.map(function(it, i){
    var opts = it.opts || d.opts;
    return '<div class="dq' + (i === 0 ? ' cur' : '') + '" data-i="' + i + '"><p class="dq-s"><b>' + (i + 1) + ' of ' + d.items.length + '</b>' + esc(it.s) + '</p><div class="dq-opts" role="group" aria-label="Choose one">' +
      opts.map(function(o, oi){ return '<button type="button" data-o="' + oi + '" aria-pressed="false">' + esc(o) + '</button>'; }).join('') +
      '</div><p class="dq-x" role="status"></p><div class="dq-nav">' + (i < d.items.length - 1 ? '<button type="button" class="btn btn-primary btn-sm" data-next="1" hidden>Next' + ARROW + '</button>' : '') + '</div></div>';
  }).join('');
  function pips(){ return '<span class="pips" aria-hidden="true">' + d.items.map(function(it, i){ return '<i class="' + (done[i] === 1 ? 'ok' : done[i] === 2 ? 'no' : '') + '"></i>'; }).join('') + '</span>'; }
  function show(i){ $$('.dq', el).forEach(function(q, qi){ q.classList.toggle('cur', qi === i); }); cur = i; var f = $$('.dq', el)[i].querySelector('button:not([disabled])'); if(f) f.focus({ preventScroll:true }); }
  el.addEventListener('click', function(e){
    var nx = e.target.closest('button[data-next]');
    if(nx){ if(cur < d.items.length - 1) show(cur + 1); return; }
    var b = e.target.closest('button[data-o]'); if(!b || b.disabled) return;
    var q = b.closest('.dq'), i = parseInt(q.getAttribute('data-i'), 10), oi = parseInt(b.getAttribute('data-o'), 10), it = d.items[i], opts = it.opts || d.opts;
    var ok = oi === it.a;
    $$('button[data-o]', q).forEach(function(x){ x.disabled = true; x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); if(parseInt(x.getAttribute('data-o'), 10) === it.a) x.classList.add('is-answer'); });
    q.classList.add(ok ? 'right' : 'wrong');
    q.querySelector('.dq-x').innerHTML = '<b>' + (ok ? 'Right. ' : 'Not quite. The answer is ' + esc(opts[it.a]) + '. ') + '</b>' + esc(it.x);
    var nb = q.querySelector('button[data-next]'); if(nb){ nb.hidden = false; nb.focus({ preventScroll:true }); }
    done[i] = ok ? 1 : 2; if(ok) right++;
    var n = Object.keys(done).length;
    if(status) status.innerHTML = pips() + '<span>' + n + ' of ' + d.items.length + ' ' + d.verb + '.' + (n === d.items.length ? ' ' + right + ' of ' + d.items.length + ' right. Activity complete.' : '') + '</span>';
    if(n === d.items.length){ if(d.prog) progDone(d.prog); try{ document.dispatchEvent(new CustomEvent('fe:drilldone', { detail:name })); }catch(err){} }
  });
  if(status) status.innerHTML = pips() + '<span>0 of ' + d.items.length + ' ' + d.verb + '.</span>';
}
$$('[data-drill]').forEach(buildDrill);

/* ══════════ lesson 3: the outline's myth / reality cards: call it, then flip ══════════ */
var MYTHS = [
  { m:'“If Vanderbilt allows someone to say something, Vanderbilt agrees with it.”', r:'Protecting someone’s ability to express an idea does not constitute endorsement of that idea.' },
  { m:'“Free expression means people can say or do anything they want anywhere on campus.”', r:'Free expression is broad, but it is not unlimited. Vanderbilt maintains policies governing the time, place, and manner of demonstrations and protests so expression can occur while university activities, safety, access, and the rights of others are protected.' },
  { m:'“Civil discourse means everyone has to be polite or agree.”', r:'Civil discourse can involve deep and vigorous disagreement. The goal is constructive engagement, not the absence of conflict.' },
  { m:'“If speech is offensive, Vanderbilt should stop it.”', r:'Expression does not lose protection simply because it is controversial, unpopular, disagreeable, or offensive. Vanderbilt encourages discussion, debate, and dialogue in response to opposing ideas.' },
  { m:'“Free expression means protesters can prevent a speaker from being heard.”', r:'Protest and counterexpression are valued forms of expression, but protesters must also respect the rights of others to access an event, hear and see a speaker, and participate in university activities.' }
];
(function(){
  var grid = $('#myths-grid'), status = $('#mythsStatus'); if(!grid) return;
  var calls = {};
  grid.innerHTML = MYTHS.map(function(x, i){
    return '<div class="fe-myth" data-m="' + i + '"><div class="fe-myth-in">' +
      '<div class="fe-myth-front"><span class="v-label">Myth ' + (i + 1) + '</span><p>' + esc(x.m) + '</p>' +
        '<div class="fe-myth-call" role="group" aria-label="Before you flip: your call on myth ' + (i + 1) + '"><button type="button" data-c="1">I have believed this</button><button type="button" data-c="0">I knew it was a myth</button></div></div>' +
      '<div class="fe-myth-back" aria-live="polite"><span class="v-label">Reality</span><p></p></div>' +
    '</div></div>';
  }).join('');
  function paint(){
    var n = Object.keys(calls).length, b = Object.keys(calls).filter(function(k){ return calls[k] === 1; }).length;
    if(status) status.textContent = n + ' of ' + MYTHS.length + ' flipped.' + (n === MYTHS.length ? ' Activity complete.' : '');
    set('myths-believed', String(b));
    if(n === MYTHS.length) progDone('myths');
  }
  grid.addEventListener('click', function(e){
    var btn = e.target.closest('button[data-c]'); if(!btn) return;
    var card = btn.closest('.fe-myth'), i = +card.getAttribute('data-m');
    calls[i] = +btn.getAttribute('data-c');
    card.classList.add('flipped');
    var back = card.querySelector('.fe-myth-back');
    back.querySelector('p').textContent = MYTHS[i].r;
    $$('.fe-myth-call button', card).forEach(function(x){ x.disabled = true; });
    back.setAttribute('tabindex', '-1'); back.focus({ preventScroll:true });
    paint();
  });
  paint();
})();

/* ══════════ knowledge check: five questions from the outline, one at a time ══════════ */
var QUIZ = [
  { seg:'Free expression', q:'When Vanderbilt protects someone’s ability to express an idea, that means...', opts:['Vanderbilt agrees with the idea', 'Vanderbilt is protecting the expression, not endorsing it', 'Staff must agree with the idea'], a:1, x:'Protecting someone’s ability to express an idea does not constitute endorsement of that idea.' },
  { seg:'Civil discourse', q:'Civil discourse means...', opts:['Everyone has to be polite or agree', 'Effective, respectful dialogue across difference, which can involve deep and vigorous disagreement', 'Avoiding difficult topics'], a:1, x:'Civil discourse can involve deep and vigorous disagreement. The goal is constructive engagement, not the absence of conflict.' },
  { seg:'Time, place, and manner', q:'When staff encounter expressive activity, the key question is generally...', opts:['Do I agree with this message?', 'Is it consistent with university policy, and does it allow others to continue speaking, listening, teaching, learning, and participating?', 'Is anyone offended?'], a:1, x:'The key question is not “Do I agree with this message?” but whether the expression is consistent with university policy and allows others to continue their activities.' },
  { seg:'Four kinds of expression', q:'A short, spontaneous, nonviolent verbal or nonverbal reaction to a speaker is...', opts:['A demonstration', 'A counterprotest', 'Dissent'], a:2, x:'Dissent. By its nature, it may occur spontaneously without advance university review.' },
  { seg:'The staff role', q:'Which of these is part of the staff role?', opts:['Personally resolve any protest you encounter', 'Know the appropriate university contact or escalation pathway, and follow the direction of designated university officials', 'Decide whether a message is too controversial'], a:1, x:'Do not independently attempt to resolve a protest or demonstration outside your role. Know the appropriate contact, follow designated officials, and avoid unnecessary escalation.' }
];
(function(){
  var box = $('#quizBox'), status = $('#quizStatus'), done = $('#quizDone'); if(!box) return;
  var PASS = 4, cur = 0, score = 0, answered = {};
  function render(){
    cur = 0; score = 0; answered = {};
    box.innerHTML = QUIZ.map(function(it, i){
      return '<div class="kq' + (i === 0 ? ' cur' : '') + '" data-i="' + i + '"><p class="kq-q"><span class="qn">' + (i + 1) + ' of ' + QUIZ.length + ' &middot; ' + esc(it.seg) + '</span><br>' + esc(it.q) + '</p><div class="kq-opts" role="group" aria-label="Choose one">' +
        it.opts.map(function(o, oi){ return '<button type="button" data-o="' + oi + '" aria-pressed="false">' + esc(o) + '</button>'; }).join('') +
        '</div><p class="kq-x" role="status"></p><div class="kq-nav">' + (i < QUIZ.length - 1 ? '<button type="button" class="btn btn-primary btn-sm" data-next="1">Next question' + ARROW + '</button>' : '<button type="button" class="btn btn-primary btn-sm" data-finish="1">See my score</button>') + '</div></div>';
    }).join('');
    done.classList.remove('show'); done.innerHTML = '';
    if(status) status.textContent = '0 of ' + QUIZ.length + ' answered.';
  }
  function show(i){ $$('.kq', box).forEach(function(q, qi){ q.classList.toggle('cur', qi === i); }); cur = i; var f = $$('.kq', box)[i].querySelector('button:not([disabled])'); if(f) f.focus({ preventScroll:true }); }
  function finish(){
    var t = score === QUIZ.length ? ['Perfect score.', 'Turn the page and put it into practice.'] : score >= PASS ? ['Well done.', 'Reread the explanation under the one you missed, then turn the page.'] : ['Almost there.', 'Four of five finishes the check. Each question names the lesson to revisit; then retake it.'];
    done.innerHTML = '<div class="big-score">' + score + ' / ' + QUIZ.length + '</div><h3>' + t[0] + '</h3><p>' + t[1] + '</p><button type="button" class="btn btn-ghost btn-sm" id="quizRetake">Retake the check</button>';
    done.classList.add('show');
    $$('.kq', box).forEach(function(q){ q.classList.remove('cur'); });
    set('quiz-score', String(score));
    if(score >= PASS) progDone('quiz');
    var rt = $('#quizRetake'); rt.addEventListener('click', function(){ render(); show(0); }); rt.focus({ preventScroll:true });
  }
  box.addEventListener('click', function(e){
    if(e.target.closest('button[data-next]')){ show(cur + 1); return; }
    if(e.target.closest('button[data-finish]')){ finish(); return; }
    var b = e.target.closest('button[data-o]'); if(!b || b.disabled) return;
    var q = b.closest('.kq'), i = parseInt(q.getAttribute('data-i'), 10), oi = parseInt(b.getAttribute('data-o'), 10), it = QUIZ[i];
    var ok = oi === it.a;
    $$('button[data-o]', q).forEach(function(x){ x.disabled = true; x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); if(parseInt(x.getAttribute('data-o'), 10) === it.a) x.classList.add('is-answer'); });
    q.classList.add(ok ? 'right' : 'wrong');
    q.querySelector('.kq-x').innerHTML = '<b>' + (ok ? 'Right. ' : 'Not quite. The answer is: ' + esc(it.opts[it.a]) + '. ') + '</b>' + esc(it.x);
    if(!answered[i]){ answered[i] = 1; if(ok) score++; }
    if(status) status.textContent = Object.keys(answered).length + ' of ' + QUIZ.length + ' answered.';
  });
  render();
})();

/* ══════════ from principle to practice: the outline's five questions, one move ══════════ */
var CONSIDER = [
  'How can you make room for questions?',
  'How can you model curiosity when you disagree?',
  'How can you help students encounter different perspectives?',
  'How can you distinguish discomfort from disruption?',
  'How can you support expression while maintaining appropriate boundaries on conduct?'
];
(function(){
  var list = $('#considerList'), qEl = $('#practiceQ'), ta = $('#practiceText'), save = $('#practiceSave'), saved = $('#practiceSaved'); if(!list) return;
  var pick = get('consider') === null ? -1 : +get('consider');
  list.innerHTML = CONSIDER.map(function(t, i){ return '<button type="button" role="radio" aria-checked="false" tabindex="-1" data-c="' + i + '"><span class="cb" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg></span><b>' + esc(t) + '</b></button>'; }).join('');
  var btns = $$('button[data-c]', list);
  if(ta) ta.value = get('practice') || '';
  function paint(){
    btns.forEach(function(b, i){ b.setAttribute('aria-checked', i === pick ? 'true' : 'false'); b.tabIndex = (i === pick || (pick < 0 && i === 0)) ? 0 : -1; });
    if(qEl) qEl.textContent = pick >= 0 ? CONSIDER[pick] : 'Pick a question on the left to start.';
    if(pick >= 0 && (get('practice') || '').trim().length > 3) progDone('practice');
  }
  function choose(i, focus){ pick = i; set('consider', String(i)); paint(); if(focus) btns[i].focus(); }
  list.addEventListener('click', function(e){ var b = e.target.closest('button[data-c]'); if(b) choose(+b.getAttribute('data-c')); });
  list.addEventListener('keydown', function(e){
    var b = e.target.closest('button[data-c]'); if(!b) return;
    var i = +b.getAttribute('data-c'), n = null;
    if(e.key === 'ArrowDown' || e.key === 'ArrowRight') n = (i + 1) % CONSIDER.length; else if(e.key === 'ArrowUp' || e.key === 'ArrowLeft') n = (i + CONSIDER.length - 1) % CONSIDER.length;
    if(n === null) return; e.preventDefault(); e.stopPropagation(); choose(n, true);
  });
  if(save) save.addEventListener('click', function(){
    var v = (ta.value || '').trim();
    if(v.length < 4){ saved.textContent = 'Write your move first.'; ta.focus(); return; }
    set('practice', v);
    saved.textContent = pick >= 0 ? 'Committed. Saved in this browser.' : 'Saved. Now pick the question it answers.';
    paint();
  });
  paint();
})();

SECTIONS.forEach(function(s){ if(progIs(s.k)) turnDone(s.k); });

/* ══════════ print my summary: results and everything the learner wrote ══════════ */
(function(){ try{ var im = new Image(); im.src = './assets/img/vu-lockup-black.png'; }catch(e){} })();
function buildPrint(){
  var sheet = $('#printSheet'); if(!sheet) return;
  function val(k){ return (get(k) || '').trim(); }
  var done = SECTIONS.filter(function(s){ return progIs(s.k); }).length;
  var score = get('quiz-score'), pick = get('consider'), move = val('practice'), forum = val('forum-reflect');
  var today = new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });
  var nm = ''; try{ var q = new URLSearchParams(location.search); nm = q.get('name') || ''; }catch(e){}
  var E = C.escalation || {}, L = C.links || {};
  var html = '<header class="ps-head"><img src="./assets/img/vu-lockup-black.png" alt="Vanderbilt University" width="166" height="43" /><div><span class="ps-k">Free Expression at Vanderbilt</span><h1>Room to <em>disagree</em>.</h1><p>' + (nm ? esc(nm) + ' &middot; ' : '') + esc(today) + '</p></div></header>';
  var RECAP = [
    ['Why it matters', 'The university’s commitment is not merely to allow disagreement, but to maintain an environment in which disagreement and intellectual exploration can occur.'],
    ['Three principles', 'Free expression, open forums, and civil discourse. Protecting expression is not the same as endorsing expression.'],
    ['Staff should model', 'Curiosity over assumption, questions over declarations when facilitating dialogue, consistency in applying university rules, de-escalation over confrontation, and respect for expression while maintaining appropriate boundaries on conduct.'],
    ['The key question', 'Not “Do I agree with this message?” but whether the expression is consistent with university policy and allows others to continue speaking, listening, teaching, learning, researching, participating, and accessing university activities.'],
    ['The staff role', 'Focus on conduct, not viewpoint. Know the appropriate contact, follow the direction of designated university officials, and avoid unnecessary escalation.']
  ];
  html += '<section class="ps-recap"><h2>What the course covered</h2><ol>' + RECAP.map(function(r, i){ return '<li><span class="ps-n">' + (i + 1) + '</span><span><b>' + esc(r[0]) + '.</b> ' + esc(r[1]) + '</span></li>'; }).join('') + '</ol></section>';
  html += '<section class="ps-row"><div class="ps-stat"><b>' + done + '/' + SECTIONS.length + '</b><span>activities complete</span></div><div class="ps-stat"><b>' + (score === null ? '&ndash;' : esc(score) + '/5') + '</b><span>quick check score</span></div><div class="ps-stat"><b>' + (get('myths-believed') === null ? '&ndash;' : esc(get('myths-believed')) + '/5') + '</b><span>myths I had believed</span></div></section>';
  html += '<section><h2>My one move</h2>' + (pick !== null ? '<p class="ps-sub">' + esc(CONSIDER[+pick] || '') + '</p>' : '') + '<p class="ps-write">' + (move ? esc(move) : '<span class="ps-empty">Not written yet. Lesson 6, from principle to practice.</span>') + '</p>' +
    (forum ? '<h3>Where we create opportunities to encounter different perspectives</h3><p class="ps-write">' + esc(forum) + '</p>' : '') + '</section>';
  html += '<section><h2>My escalation pathway</h2><p class="ps-write">' + (E.name ? esc(E.name) + (E.phone ? ' &middot; ' + esc(E.phone) : '') + (E.email ? ' &middot; ' + esc(E.email) : '') : 'Contact: ______________________ &nbsp; Phone: ______________') + '</p></section>';
  html += '<section><h2>Keep these close</h2><table class="ps-table"><tbody>' + [['Freedom of Expression Policy', L.freedomOfExpression], ['Use of University Space', L.useOfSpace], ['Statement of Principles', L.principles], ['Community Creed', L.creed], ['Dialogue Vanderbilt', L.dialogue]].map(function(r){ return '<tr><th>' + esc(r[0]) + '</th><td>' + esc(r[1] || '') + '</td></tr>'; }).join('') + '</tbody></table><p class="ps-foot">A culture to sustain.</p></section>';
  sheet.innerHTML = html;
}
window.addEventListener('beforeprint', buildPrint);
document.addEventListener('click', function(e){
  if(!e.target.closest('[data-print]')) return;
  narrStop(); buildPrint();
  try{ window.print(); }catch(err){ toast('Printing is not available here. Use your browser menu to print.'); }
});

/* ══════════ exit: close the window when the LMS opened it, otherwise back to the start ══════════ */
(function(){
  var b = $('#exitBtn'); if(!b) return;
  b.addEventListener('click', function(){
    narrStop();
    if(C.exitUrl){ location.href = C.exitUrl; return; }
    try{ window.close(); }catch(e){}
    window.setTimeout(function(){ if(window.chartPager) window.chartPager.go(0, { focus:true }); toast('You can close this tab. Thank you.'); }, 200);
  });
})();

progRender();
/* for tests */
window.FE_COURSE = { SCENARIOS: SCENARIOS, QUIZ: QUIZ, DRILLS: DRILLS, MYTHS: MYTHS, TABSETS: TABSETS };
})();
