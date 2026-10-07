/* ══════════ FREE EXPRESSION AT VANDERBILT · app engine ══════════
   Built on the Vanderbilt Voyage Online engine (me5231979/Voyage_Online,
   app.js): the same narration layer, progress rail, one-at-a-time drills,
   your-call scenarios, and knowledge check, with this course's content
   and a few new modules (myth cards, time/place/manner tabs, forum chips,
   reflections). Fifteen tracked activities. State: localStorage fe1-* in
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
  var h = $('#heroHello'); if(h && name) h.textContent = 'Welcome, ' + name + '. Free expression, open forums, and civil discourse, and the part staff play in keeping them alive.';
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
  { k:'tradition',  no:'01', name:'A tradition of open debate',  how:'Visit every moment on the timeline' },
  { k:'commitment', no:'02', name:'The three principles',        how:'Open all three' },
  { k:'expression', no:'03', name:'Free expression',             how:'Protecting or endorsing, four moments' },
  { k:'forums',     no:'04', name:'Open forums',                 how:'Tap a forum and save a reflection' },
  { k:'civil',      no:'05', name:'Civil discourse',             how:'Sort eight cards' },
  { k:'role',       no:'06', name:'Our responsibility as staff', how:'Five moments to model' },
  { k:'myths',      no:'07', name:'Myths and realities',         how:'Flip all five cards' },
  { k:'question',   no:'08', name:'Four kinds of expression',    how:'Name all four' },
  { k:'tpm',        no:'09', name:'Time, place, and manner',     how:'Answer all three questions' },
  { k:'context',    no:'10', name:'Why context matters',         how:'Six calls at a protest' },
  { k:'policies',   no:'11', name:'Related policies',            how:'Match four requests' },
  { k:'staffrole',  no:'12', name:'The staff role',              how:'Viewpoint or conduct, six calls' },
  { k:'scenarios',  no:'13', name:'Check your understanding',    how:'Find the best response in three moments' },
  { k:'quiz',       no:'14', name:'A quick check',               how:'Score 4 of 5' },
  { k:'practice',   no:'15', name:'From principle to practice',  how:'Pick a question and commit to one move' }
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

/* ── completion modal (fires once when all fifteen are done) ── */
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


/* ══════════ lesson 1: a tradition of open debate, as a living timeline ══════════ */
var TL = [
  { y:'1873', era:'The founding', h:'A university to bridge a divide', p:'Vanderbilt is founded after the Civil War, with a stated aspiration of “strengthening the ties which should exist between all sections of our common country.”' },
  { y:'1967', era:'The Civil Rights Movement', h:'The Impact Symposium', p:'Students invite Martin Luther King Jr., Stokely Carmichael, Strom Thurmond, and Allen Ginsberg. The Tennessee Senate condemns the invitation. Chancellor Alexander Heard holds to the open forum, and more than 4,000 people come to listen.' },
  { y:'2023', era:'Today', h:'Dialogue Vanderbilt', p:'The university launches Dialogue Vanderbilt to advance civil discourse and bolster its commitment to free expression, amid increasing polarization and challenges facing higher education.' },
  { y:'2024', era:'Today', h:'Clear rules, stated principles', p:'Vanderbilt updates its freedom of expression policies, expands civil discourse programming, and affirms a Statement of Principles on academic freedom, free expression, open debate, and dissent.' },
  { y:'2026', era:'Today', h:'250 Conversations on America', p:'For the nation’s 250th anniversary, Vanderbilt invites its community into conversations across difference: a renewed investment in open inquiry, dialogue, and civil discourse.' }
];
(function(){
  var box = $('#tl'); if(!box) return;
  box.innerHTML = '<div class="tl-track"><div class="tl-line" aria-hidden="true"><i id="tlFill"></i></div><div class="tl-nodes" role="tablist" aria-label="Free expression at Vanderbilt, 1873 to today">' +
    TL.map(function(t, i){ return '<button type="button" role="tab" class="tl-node" aria-selected="false" aria-controls="tlCard" data-t="' + i + '" style="--d:' + (i * 50) + 'ms"><span class="dot" aria-hidden="true"></span><span class="yr">' + t.y + '</span></button>'; }).join('') + '</div></div>' +
    '<div class="tl-card" role="tabpanel" aria-live="polite" id="tlCard"></div>' +
    '<div class="tl-ctl"><button type="button" class="btn btn-ghost btn-sm" id="tlPlay" aria-pressed="false"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg><span>Play the timeline</span></button><span class="tl-count" id="tlCount" aria-hidden="true"></span></div>';
  var nodes = $$('.tl-node', box), card = $('#tlCard'), fill = $('#tlFill'), playBtn = $('#tlPlay'), count = $('#tlCount');
  var cur = -1, timer = null, seen = {};
  function show(i, focus){
    cur = i; var t = TL[i]; seen[i] = 1; nodes[i].classList.add('seen');
    if(Object.keys(seen).length === TL.length) progDone('tradition');
    nodes.forEach(function(n, ni){ n.setAttribute('aria-selected', ni === i ? 'true' : 'false'); n.classList.toggle('past', ni < i); n.tabIndex = ni === i ? 0 : -1; });
    if(fill) fill.style.width = (i / (TL.length - 1) * 100) + '%';
    card.innerHTML = '<span class="v-label">' + esc(t.era) + '</span><div class="tl-body"><b class="tl-yr">' + esc(t.y) + '</b><div><h3>' + esc(t.h) + '</h3><p>' + esc(t.p) + '</p></div></div>';
    card.classList.remove('in'); void card.offsetWidth; card.classList.add('in');
    if(count) count.textContent = (i + 1) + ' / ' + TL.length;
    if(focus) nodes[i].focus();
  }
  function stop(){ if(timer){ window.clearInterval(timer); timer = null; } playBtn.setAttribute('aria-pressed', 'false'); playBtn.querySelector('span').textContent = 'Play the timeline'; }
  function play(){
    if(timer){ stop(); return; }
    narrStop();
    if(cur >= TL.length - 1) show(0); else show(cur + 1);
    playBtn.setAttribute('aria-pressed', 'true'); playBtn.querySelector('span').textContent = 'Pause';
    timer = window.setInterval(function(){ if(cur >= TL.length - 1){ stop(); return; } show(cur + 1); }, 5200);
  }
  box.addEventListener('click', function(e){ var n = e.target.closest('.tl-node'); if(n){ stop(); show(+n.getAttribute('data-t')); } });
  box.addEventListener('keydown', function(e){
    if(!e.target.closest('.tl-node')) return;
    if(e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'Home' && e.key !== 'End') return;
    e.preventDefault(); e.stopPropagation(); stop();
    var n = e.key === 'Home' ? 0 : e.key === 'End' ? TL.length - 1 : Math.min(Math.max(cur + (e.key === 'ArrowRight' ? 1 : -1), 0), TL.length - 1);
    show(n, true);
  });
  playBtn.addEventListener('click', play);
  document.addEventListener('chart:page', function(ev){
    stop();
    if(ev.detail && ev.detail.key === 'tradition'){ box.classList.remove('drawn'); void box.offsetWidth; box.classList.add('drawn'); }
  });
  show(0);
  box.classList.add('drawn');
})();

/* ══════════ lesson 1: the three principles open in place ══════════ */
(function(){
  var list = $('#principleList'); if(!list) return;
  var seen = {};
  $$('button', list).forEach(function(b, i){ b.addEventListener('click', function(){
    var o = b.getAttribute('aria-expanded') !== 'true'; b.setAttribute('aria-expanded', o ? 'true' : 'false');
    if(o){ seen[i] = 1; if(Object.keys(seen).length === 3) progDone('commitment'); }
  }); });
})();

/* ══════════ lesson 2: open forums, tap what you have seen, then reflect ══════════ */
var FORUMS = ['Classroom conversations', 'Lectures and speaker programs', 'Debates', 'Student organization events', 'Dialogue programs', 'Public forums', 'Peaceful demonstrations and counterexpression', 'Informal conversations across difference'];
(function(){
  var box = $('#forumChips'), ta = $('#forumReflect'), save = $('#forumSave'), saved = $('#forumSaved'), count = $('#forumCount'); if(!box) return;
  var on = (function(){ try{ var v = JSON.parse(get('forums') || '[]'); return Array.isArray(v) ? v : []; }catch(e){ return []; } })();
  box.innerHTML = FORUMS.map(function(f, i){ return '<button type="button" aria-pressed="false" data-f="' + i + '"><span class="cb" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg></span>' + esc(f) + '</button>'; }).join('');
  if(ta) ta.value = get('forum-reflect') || '';
  function check(){ if(on.filter(Boolean).length && (get('forum-reflect') || '').trim().length > 3) progDone('forums'); }
  function paint(){
    $$('button[data-f]', box).forEach(function(b){ b.setAttribute('aria-pressed', on[+b.getAttribute('data-f')] ? 'true' : 'false'); });
    var n = on.filter(Boolean).length;
    if(count) count.textContent = n ? n + ' of ' + FORUMS.length + ' are part of your work. Every one of them is an open forum.' : 'Open forums can include all eight.';
    check();
  }
  box.addEventListener('click', function(e){ var b = e.target.closest('button[data-f]'); if(!b) return; var i = +b.getAttribute('data-f'); on[i] = !on[i]; set('forums', JSON.stringify(on)); paint(); });
  if(save) save.addEventListener('click', function(){
    var v = (ta.value || '').trim();
    if(v.length < 4){ saved.textContent = 'Write a sentence first.'; ta.focus(); return; }
    set('forum-reflect', v); saved.textContent = 'Saved in this browser.' + (on.filter(Boolean).length ? '' : ' Now tap at least one forum on the left.'); check();
  });
  paint();
})();

/* ══════════ your call: one scenario, three responses, consequences ══════════ */
var SCENARIOS = {
  ev1: { h:'Moment 1 · The controversial speaker', s:'Students tell you that another student group has invited a speaker whose views are offensive, and they ask that the event be canceled.', opts:[
    { t:'Cancel the event if enough students object.', b:'Letting offense decide', best:false, out:'Disagreement or offense alone does not determine whether expression may occur. If the number of objections decided it, any idea could be shut down by the people who dislike it most.' },
    { t:'Explain that disagreement or offense alone does not determine whether expression may occur, and discuss appropriate opportunities for dialogue or counterexpression.', b:'The best response', best:true, out:'The students feel heard, and they leave with real options: a question for the speaker, a counterevent, a statement of their own. Their expression is protected too.' },
    { t:'Tell the students they should not object to invited speakers.', b:'Shutting down the objection', best:false, out:'Objecting is expression too. Protest and counterexpression are valued forms of expression; the students only need to know what they can do, and how.' }
  ]},
  ev2: { h:'Moment 2 · The protest', s:'Students stand outside the event holding signs opposing the speaker. They do not block the entrance, and attendees can enter and participate without disruption. Is the fact that the protest directly targets the event itself a policy problem?', opts:[
    { t:'Yes. A protest aimed at an event interferes with it by definition.', b:'Confusing target with disruption', best:false, out:'Protests are, by definition, connected to another event. That is allowed. What matters is how the protest is carried out.' },
    { t:'Only if the speaker or the hosts are upset by it.', b:'Letting feelings decide', best:false, out:'Discomfort is not the test. The test is conduct: can others still enter, hear, and take part?' },
    { t:'No. The relevant question is whether the activity complies with university policy and allows others to access and participate in the event.', b:'The best response', best:true, out:'Protest and counterexpression are valued forms of expression. Silent signs outside, with the doors clear, is the system working.' }
  ]},
  ev3: { h:'Moment 3 · When protest becomes disruption', s:'During the event, protesters repeatedly shout so that the speaker cannot be heard and attendees cannot reasonably participate. What has changed?', opts:[
    { t:'Nothing. Shouting is dissent, and dissent is always protected.', b:'Stretching dissent', best:false, out:'Dissent is a short, spontaneous reaction to a speaker. Sustained shouting that stops the event is something else.' },
    { t:'The manner of expression is now interfering with the rights of others to participate, bringing time, place, and manner rules into play.', b:'The best response', best:true, out:'The issue is no longer the protesters’ viewpoint or their decision to protest. Use your escalation pathway, follow the direction of designated officials, and avoid escalating it yourself.' },
    { t:'The protesters’ message has become too offensive to allow.', b:'Back to viewpoint', best:false, out:'The message has not changed. Their conduct has. Staff respond to conduct, not viewpoint.' }
  ]}
};
function buildScenario(el){
  var name = el.getAttribute('data-scn'), sc = SCENARIOS[name]; if(!sc) return;
  var tried = {};
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
    var n = Object.keys(tried).length;
    out.innerHTML = '<span class="vtag' + (o.best ? ' best' : '') + '">' + (o.best ? 'Vanderbilt’s approach: ' : 'Consider: ') + esc(o.b) + '</span><p>' + esc(o.out) + '</p>' +
      (n < sc.opts.length ? '<p class="scn-again hinttxt">' + (o.best ? 'See why the other responses miss. ' : 'Now pick the response that fits Vanderbilt’s approach. ') + n + ' of ' + sc.opts.length + ' tried.</p>' : '<p class="scn-again hinttxt">All three tried.</p>');
    out.classList.add('show');
  });
}
var CALL_SETS = { event:['ev1', 'ev2', 'ev3'] };
var CALL_PROG = { event:{ prog:'scenarios', noun:'moments', status:'#scenariosStatus', narr:'scenarios/s' } };
function buildCalls(el){
  var name = el.getAttribute('data-calls'), keys = CALL_SETS[name]; if(!keys) return;
  var cfg = CALL_PROG[name], status = $(cfg.status), found = {}, cur = 0;
  el.innerHTML = keys.map(function(k, i){
    var sc = SCENARIOS[k];
    return '<div class="cq' + (i === 0 ? ' cur' : '') + '" data-k="' + k + '"><p class="cq-h">' + esc(sc.h) + subBtn(cfg.narr + (i + 1)) + '</p><div class="scn" data-scn="' + k + '"></div><div class="cq-nav">' +
      (i < keys.length - 1 ? '<button type="button" class="btn btn-primary btn-sm" data-next="1" hidden>Next moment' + ARROW + '</button>' : '') +
      (i > 0 ? '<button type="button" class="btn btn-ghost btn-sm" data-prev="1">Back</button>' : '') + '</div></div>';
  }).join('');
  $$('.scn[data-scn]', el).forEach(buildScenario);
  function pips(){ return '<span class="pips" aria-hidden="true">' + keys.map(function(k){ return '<i class="' + (found[k] ? 'ok' : '') + '"></i>'; }).join('') + '</span>'; }
  function paint(){ var n = Object.keys(found).length; if(status) status.innerHTML = pips() + '<span>' + n + ' of ' + keys.length + ' ' + cfg.noun + '.' + (n === keys.length ? ' Activity complete.' : '') + '</span>'; if(n === keys.length) progDone(cfg.prog); }
  function show(i){ $$('.cq', el).forEach(function(q, qi){ q.classList.toggle('cur', qi === i); }); cur = i; var f = $$('.cq', el)[i].querySelector('.scn button'); if(f) f.focus({ preventScroll:true }); narrSub(cfg.narr + (i + 1)); }
  el.addEventListener('click', function(e){
    if(e.target.closest('button[data-next]')){ show(cur + 1); return; }
    if(e.target.closest('button[data-prev]')){ show(cur - 1); return; }
    var b = e.target.closest('.scn button[data-o]'); if(!b) return;
    var q = b.closest('.cq'), k = q.getAttribute('data-k'), o = SCENARIOS[k].opts[parseInt(b.getAttribute('data-o'), 10)];
    var nx = q.querySelector('button[data-next]'); if(nx) nx.hidden = false;
    if(o.best){ found[k] = 1; paint(); }
  });
  paint();
}
$$('[data-calls]').forEach(buildCalls);

/* ══════════ drills: one card at a time, feedback after each ══════════ */
var DRILLS = {
  expression: { opts:['Protecting', 'Endorsing'], prog:'expression', verb:'decided', items:[
    { s:'Event services reserves a lecture hall for a student group’s speaker, the same way it would for any registered group.', a:0, x:'Same process for every group keeps the conditions in which ideas can be expressed, examined, challenged, and debated. It says nothing about whether Vanderbilt agrees.' },
    { s:'An advisor tells a student organization that the speaker is right and the critics are wrong.', a:1, x:'Staff hold their own views, and that is fine. Taking a side on the idea is not the staff role. The job is to keep the room open, not to judge the argument.' },
    { s:'A staff member keeps a walkway clear so a group can hand out flyers some passersby find offensive.', a:0, x:'Expression does not lose protection because it is offensive. Keeping access clear for everyone is the job.' },
    { s:'A residence hall director hosts a forum where students on both sides of a debate present their case.', a:0, x:'Creating the conditions for competing views to be heard is the work. Hosting the forum is not a vote for either side.' }
  ]},
  civil: { opts:['A habit to practice', 'Not required'], prog:'civil', verb:'sorted', items:[
    { s:'Agreement', a:1, x:'Civil discourse does not require agreement. It can involve deep and vigorous disagreement.' },
    { s:'Listen to understand before responding.', a:0, x:'A habit to practice. So is asking before assuming.' },
    { s:'Avoiding difficult topics', a:1, x:'Not required. Difficult topics are where civil discourse earns its keep.' },
    { s:'Separate a person from an argument.', a:0, x:'A habit to practice. You can take an argument apart and still respect the person who made it.' },
    { s:'Reaching consensus', a:1, x:'Not required. The goal is constructive engagement, not the absence of conflict.' },
    { s:'Ask questions that test ideas rather than attack people.', a:0, x:'A habit to practice, along with using evidence and reasoning.' },
    { s:'Suppressing strongly held views, or pretending differences do not exist', a:1, x:'Not required. Civil discourse makes room for strong views and real differences.' },
    { s:'Be willing to revise your own assumptions.', a:0, x:'A habit to practice. Acknowledge uncertainty, make room for disagreement, and remember that another person may have information or insight you do not.' }
  ]},
  role: { prog:'role', verb:'decided', items:[
    { s:'A student at your service desk wears a shirt with a political slogan you dislike.', opts:['Assume you know their views on everything', 'Stay curious, and serve them like anyone else'], a:1, x:'Curiosity over assumption. The slogan tells you one thing about one view. Everything else you would only be guessing.' },
    { s:'You are facilitating a student discussion, and it gets heated.', opts:['Ask a question that tests the idea', 'Declare which side has the better argument'], a:0, x:'Questions over declarations when facilitating dialogue. A good question keeps both sides thinking; a verdict ends the conversation.' },
    { s:'Two groups ask to table on the same lawn. You agree with one and not the other.', opts:['Make it a little easier for the one you agree with', 'Apply the same reservation rules to both'], a:1, x:'Consistency in applying university rules. Rules that bend with the message are no longer rules about time, place, and manner; they are rules about viewpoint.' },
    { s:'A protester outside your building is loud but blocks nothing, and a colleague wants to go confront them.', opts:['Suggest stepping back, and call your contact if the conduct changes', 'Go out together and tell them to stop'], a:0, x:'De-escalation over confrontation. Nothing here calls for staff to act; a confrontation could turn a lawful protest into an incident.' },
    { s:'A group’s chanting starts to carry into a class in session next door.', opts:['Respect the expression, and raise the conduct with the right contact', 'Let it go; any limit would be censorship'], a:0, x:'Respect for expression while maintaining appropriate boundaries on conduct. The message is not the issue. The noise disrupting teaching is, and manner rules exist for exactly this.' }
  ]},
  types: { opts:['Demonstration', 'Protest', 'Counterprotest', 'Dissent'], prog:'question', verb:'named', items:[
    { s:'Students rally on the lawn about tuition costs. No other event is happening.', a:0, x:'A demonstration: expression independent of another campus event or activity.' },
    { s:'Students picket outside a lecture by a visiting official, objecting to the talk.', a:1, x:'A protest: expression intentionally connected to another campus event or activity.' },
    { s:'A second group gathers across the walkway to answer the picketers with signs of their own.', a:2, x:'A counterprotest: expression responding to another organizer’s activity.' },
    { s:'During a talk, an audience member briefly holds up a sign, then lowers it and keeps listening.', a:3, x:'Dissent: a short, spontaneous, nonviolent verbal or nonverbal reaction to a speaker.' }
  ]},
  context: { opts:['Generally fine', 'Crosses the line'], prog:'context', verb:'called', items:[
    { s:'Holding signs outside the entrance as attendees walk in.', a:0, x:'Silent and symbolic activity, like holding signs, may occur during protests and counterprotests.' },
    { s:'Standing in the doorway so attendees cannot get in.', a:1, x:'Expression cannot block entrances or exits, or prevent others from entering or participating in an event.' },
    { s:'Turning their backs on the speaker during the talk.', a:0, x:'Turning backs, like covering ears, is silent and symbolic. The speaker can still be heard.' },
    { s:'Chanting in the room so the speaker cannot be heard.', a:1, x:'Expression cannot prevent an audience from hearing or seeing a speaker. Audible activity may be restricted when it would interfere with the targeted event.' },
    { s:'Picketing silently along the walkway, leaving room to pass.', a:0, x:'Picketing is a permitted form of expression, and the walkway stays open.' },
    { s:'Linking arms across the sidewalk so people have to step into the street.', a:1, x:'Expression cannot impede pedestrian or vehicular movement.' }
  ]},
  policies: { opts:['Freedom of Expression', 'Use of University Space', 'Noise and Amplified Sound', 'Installations'], prog:'policies', verb:'matched', items:[
    { s:'A student group wants to plan a protest outside next week’s speaker event.', a:0, x:'The Freedom of Expression Policy governs demonstrations, protests, counterprotests, dissent, and planning. Point organizers to the Dean of Students.' },
    { s:'An organization asks to reserve the lawn and post notices for a forum.', a:1, x:'Use of University Space governs reservations, event registration, notices, and outdoor use.' },
    { s:'A rally organizer asks whether they can use a bullhorn near the library.', a:2, x:'The Excessive Noise and Amplified Sound Policy applies to noise from demonstrations, protests, events, and other campus activity.' },
    { s:'Students want to put up a temporary symbolic structure on the lawn for a week.', a:3, x:'Installations, under Use of University Space, cover temporary displays, symbolic structures, art pieces, and other physical installations used for expression.' }
  ]},
  staffrole: { opts:['Viewpoint', 'Conduct'], prog:'staffrole', verb:'sorted', items:[
    { s:'The signs say something many people find offensive.', a:0, x:'Viewpoint. Controversy or offense alone does not mean the expression violates policy.' },
    { s:'People cannot get through the building entrance.', a:1, x:'Conduct. Others can no longer enter. This is when you use your escalation pathway.' },
    { s:'The group is protesting for a cause you personally support.', a:0, x:'Viewpoint. Your agreement changes nothing either way. The rules apply the same to messages you like.' },
    { s:'Amplified sound is carrying into a class in session.', a:1, x:'Conduct. Teaching is being disrupted, and noise rules apply. Raise it with your contact.' },
    { s:'A student tells you the speaker’s ideas are dangerous.', a:0, x:'Viewpoint. Listen, and point the student to dialogue or counterexpression. Disagreement is not disruption.' },
    { s:'Someone is damaging a display another group set up.', a:1, x:'Conduct. Property damage is never protected expression. Do not intervene physically; call your contact.' }
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
    if(n === d.items.length) progDone(d.prog);
  });
  if(status) status.innerHTML = pips() + '<span>0 of ' + d.items.length + ' ' + d.verb + '.</span>';
}
$$('[data-drill]').forEach(buildDrill);

/* ══════════ lesson 3: myth cards, make your call, then flip ══════════ */
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
    if(status) status.textContent = n + ' of ' + MYTHS.length + ' flipped.' + (n ? ' You had believed ' + b + '.' : '') + (n === MYTHS.length ? ' Activity complete.' : '');
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
    var tag = card.querySelector('.fe-myth-tag');
    if(!tag){ back.insertAdjacentHTML('beforeend', '<span class="fe-myth-tag">' + (calls[i] ? 'Plenty of people believe this one. Now you know the reality.' : 'You called it.') + '</span>'); }
    back.setAttribute('tabindex', '-1'); back.focus({ preventScroll:true });
    paint();
  });
  paint();
})();

/* ══════════ lesson 4: time, place, and manner, three tabs, one question each ══════════ */
var TPM = [
  { k:'time', name:'Time', lead:'Expression may be subject to reasonable limits on when and for how long it occurs.', list:[
      'Organizers should, when possible, submit plans for demonstrations, protests, and counterprotests at least 48 hours in advance.',
      'Expression is recommended to last no longer than three hours and may not exceed 7.5 hours.',
      'Demonstrations, protests, and counterprotests may not occur at times requiring participants to sleep or gather overnight.',
      'Noise and amplified sound are subject to separate university requirements.'],
    take:'Expression is protected, but its timing cannot prevent the university from carrying out its normal activities.',
    q:'A group plans a protest. How long may it run at most?', opts:['Three hours, no exceptions', 'Up to 7.5 hours, with three recommended', 'As long as the group wants, overnight included'], a:1, x:'Expression is recommended to last no longer than three hours and may not exceed 7.5 hours, and no overnight gatherings.' },
  { k:'place', name:'Place', lead:'Expression may be subject to reasonable limits on where it occurs. Demonstrations and protests cannot occur in certain spaces where expression would interfere with privacy, safety, academic activity, essential services, or the rights of others. Examples include:', list:[
      'Private offices and residences',
      'Research laboratories and associated facilities',
      'Classrooms or meeting spaces while classes or private meetings are occurring',
      'Residential areas during quiet hours',
      'Student health and wellbeing facilities',
      'Vanderbilt University Medical Center and areas where access to medical services could be obstructed',
      'Certain areas containing sensitive records, equipment, or materials',
      'Critical university infrastructure'],
    more:'Other rules protect entrances, exits, sidewalks, pedestrian and vehicular movement, and access to university activities.',
    take:'A person’s ability to express a message does not include a right to occupy every university space for that purpose.',
    q:'Which of these is a place where a demonstration cannot occur?', opts:['Anywhere a staff member finds the message upsetting', 'A classroom while a class is in session', 'Any outdoor space on campus'], a:1, x:'Classrooms or meeting spaces while classes or private meetings are occurring are on the list. The message never decides the place.' },
  { k:'manner', name:'Manner', lead:'Expression may also be subject to reasonable limits on how it occurs. Vanderbilt permits many forms of expressive activity, including signs, picketing, marching, symbolic expression, and, in appropriate settings, chanting and speeches. But expression cannot:', list:[
      'Block entrances or exits.',
      'Prevent others from entering or participating in an event.',
      'Prevent an audience from hearing or seeing a speaker.',
      'Materially disrupt teaching, administration, or other authorized university activities.',
      'Impede pedestrian or vehicular movement.',
      'Cause physical harm or property damage.',
      'Violate applicable noise and amplified-sound rules.',
      'Engage in disorderly conduct or other conduct prohibited by university policy.'],
    take:'How expression happens matters. What it says does not change the rules.',
    q:'Which of these is a limit on manner?', opts:['Signs may not criticize the university', 'Only quiet, polite messages are allowed', 'Expression cannot prevent an audience from hearing or seeing a speaker'], a:2, x:'Manner limits are about conduct, like drowning out a speaker. None of them depend on what the message says.' }
];
(function(){
  var box = $('#tpmBox'), status = $('#tpmStatus'); if(!box) return;
  var answered = {}, opened = {};
  box.innerHTML = '<div class="fe-tabs" role="tablist" aria-label="Time, place, and manner">' + TPM.map(function(t, i){
      return '<button type="button" role="tab" id="tpmTab' + i + '" aria-controls="tpmPanel' + i + '" aria-selected="' + (i === 0 ? 'true' : 'false') + '" tabindex="' + (i === 0 ? '0' : '-1') + '" data-t="' + i + '"><b>' + t.name + '</b><span class="fe-tab-ok" aria-hidden="true"></span></button>'; }).join('') + '</div>' +
    TPM.map(function(t, i){
      return '<div class="fe-panel" role="tabpanel" id="tpmPanel' + i + '" aria-labelledby="tpmTab' + i + '"' + (i === 0 ? '' : ' hidden') + '><div class="fe-panel-grid"><div>' +
        '<p class="fe-lead">' + esc(t.lead) + '</p><ul class="fe-list">' + t.list.map(function(x){ return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' + (t.more ? '<p class="fe-small">' + esc(t.more) + '</p>' : '') +
        '<p class="fe-take"><span class="v-label">Key takeaway</span>' + esc(t.take) + '</p></div>' +
        '<div class="v-deck"><div class="dq cur" data-i="' + i + '"><p class="dq-s"><b>Check: ' + t.name + '</b>' + esc(t.q) + '</p><div class="dq-opts fe-stack" role="group" aria-label="Choose one">' +
          t.opts.map(function(o, oi){ return '<button type="button" data-o="' + oi + '" aria-pressed="false">' + esc(o) + '</button>'; }).join('') + '</div><p class="dq-x" role="status"></p></div></div>' +
      '</div></div>';
    }).join('');
  var tabs = $$('[role="tab"]', box), panels = $$('[role="tabpanel"]', box);
  function paint(){ var n = Object.keys(answered).length; if(status) status.textContent = n + ' of 3 answered.' + (n === 3 ? ' Activity complete.' : ''); if(n === 3) progDone('tpm'); }
  function sel(i, focus){
    opened[i] = 1;
    tabs.forEach(function(t, ti){ t.setAttribute('aria-selected', ti === i ? 'true' : 'false'); t.tabIndex = ti === i ? 0 : -1; });
    panels.forEach(function(p, pi){ p.hidden = pi !== i; });
    if(focus) tabs[i].focus();
  }
  box.addEventListener('click', function(e){
    var t = e.target.closest('[role="tab"]'); if(t){ sel(+t.getAttribute('data-t')); return; }
    var b = e.target.closest('.dq-opts button'); if(!b || b.disabled) return;
    var q = b.closest('.dq'), i = +q.getAttribute('data-i'), it = TPM[i], oi = +b.getAttribute('data-o'), ok = oi === it.a;
    $$('button', q.querySelector('.dq-opts')).forEach(function(x){ x.disabled = true; x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); if(+x.getAttribute('data-o') === it.a) x.classList.add('is-answer'); });
    q.classList.add(ok ? 'right' : 'wrong');
    q.querySelector('.dq-x').innerHTML = '<b>' + (ok ? 'Right. ' : 'Not quite. The answer is: ' + esc(it.opts[it.a]) + '. ') + '</b>' + esc(it.x) + (i < 2 && !answered[i + 1] ? ' Now open ' + TPM[i + 1].name + '.' : '');
    answered[i] = 1; tabs[i].classList.add('done');
    paint();
  });
  box.addEventListener('keydown', function(e){
    var t = e.target.closest('[role="tab"]'); if(!t) return;
    var i = +t.getAttribute('data-t'), n = null;
    if(e.key === 'ArrowRight') n = (i + 1) % 3; else if(e.key === 'ArrowLeft') n = (i + 2) % 3; else if(e.key === 'Home') n = 0; else if(e.key === 'End') n = 2;
    if(n === null) return; e.preventDefault(); e.stopPropagation(); sel(n, true);
  });
  paint();
})();

/* ══════════ knowledge check: five questions, one at a time, feedback after each ══════════ */
var QUIZ = [
  { seg:'Free expression', q:'When Vanderbilt protects someone’s ability to express an idea, that means...', opts:['Vanderbilt agrees with the idea', 'The idea has been reviewed and approved', 'Vanderbilt is protecting the expression, not endorsing it', 'Staff should promote the event'], a:2, x:'Protecting someone’s ability to express an idea does not constitute endorsement of that idea.' },
  { seg:'Civil discourse', q:'Civil discourse requires...', opts:['Effective, respectful dialogue, even in vigorous disagreement', 'Agreement by the end of the conversation', 'Avoiding difficult topics', 'Everyone staying comfortable'], a:0, x:'Civil discourse can involve deep and vigorous disagreement. The goal is constructive engagement, not the absence of conflict.' },
  { seg:'Time, place, and manner', q:'Faced with a protest, the key question for staff is generally...', opts:['Do I agree with this message?', 'Is the message offensive to anyone?', 'Did the group ask my permission?', 'Is it consistent with policy, and can others still speak, listen, learn, and take part?'], a:3, x:'Not “Do I agree with this message?” but whether the expression is consistent with policy and lets everyone continue speaking, listening, teaching, learning, and participating.' },
  { seg:'Four kinds of expression', q:'A short, spontaneous, nonviolent reaction to a speaker is...', opts:['A demonstration', 'Dissent', 'A counterprotest', 'A protest'], a:1, x:'Dissent. By its nature it may occur spontaneously without advance university review.' },
  { seg:'The staff role', q:'Protesters are blocking the entrance to an event. Your first move is to...', opts:['Clear the doorway yourself', 'Ignore it; protest is protected', 'Use your escalation pathway and follow the direction of designated officials', 'Debate the protesters about their message'], a:2, x:'Blocking an entrance is conduct, not viewpoint. Do not try to resolve it outside your role: use your escalation pathway, follow designated officials, and avoid unnecessary escalation.' }
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
    $('#quizRetake').addEventListener('click', function(){ render(); show(0); });
    var rt = $('#quizRetake'); if(rt) rt.focus({ preventScroll:true });
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

/* ══════════ from principle to practice: one question, one move, a message to the team ══════════ */
var CONSIDER = [
  'How can you make room for questions?',
  'How can you model curiosity when you disagree?',
  'How can you help students encounter different perspectives?',
  'How can you distinguish discomfort from disruption?',
  'How can you support expression while maintaining appropriate boundaries on conduct?'
];
function tellPaint(){
  var tell = $('#tellText'), copy = $('#copyTell'); if(!tell) return;
  var r = (get('practice') || '').trim();
  /* "Name the conduct" reads as "name the conduct" mid-sentence; leave "I" and acronyms alone */
  if(/^[A-Z][a-z]/.test(r) && !/^I\b/.test(r)) r = r.charAt(0).toLowerCase() + r.slice(1);
  var msg = 'I just finished Free Expression at Vanderbilt. One thing I will do in my role: ' + (r ? r.replace(/[.!?]+$/, '') : '[your move]') + '. Could we talk about how our team handles this?';
  tell.textContent = '“' + msg + '”';
  if(copy) copy.setAttribute('data-copytext', msg);
}
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
    tellPaint();
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

/* ══════════ print my summary: results and everything the learner wrote ══════════
   Built fresh each time (the button, or the browser's own Print), on white,
   in the brand's type. Nothing leaves the browser. */
(function(){ try{ var im = new Image(); im.src = './assets/img/vu-lockup-black.png'; }catch(e){} })();
function buildPrint(){
  var sheet = $('#printSheet'); if(!sheet) return;
  function val(k){ return (get(k) || '').trim(); }
  var done = SECTIONS.filter(function(s){ return progIs(s.k); }).length;
  var score = get('quiz-score'), pick = get('consider'), move = val('practice'), forum = val('forum-reflect');
  var today = new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });
  var nm = ''; try{ var q = new URLSearchParams(location.search); nm = q.get('name') || ''; }catch(e){}
  var E = C.escalation || {};
  var html = '<header class="ps-head"><img src="./assets/img/vu-lockup-black.png" alt="Vanderbilt University" width="166" height="43" /><div><span class="ps-k">Free Expression at Vanderbilt</span><h1>Room to <em>disagree</em>.</h1><p>' + (nm ? esc(nm) + ' &middot; ' : '') + esc(today) + '</p></div></header>';
  var RECAP = [
    ['Why it matters', 'The commitment is not merely to allow disagreement, but to maintain an environment in which disagreement and intellectual exploration can occur.'],
    ['Three principles', 'Free expression, open forums, and civil discourse. Protecting expression is not the same as endorsing it.'],
    ['Our responsibility', 'Curiosity over assumption, questions over declarations, consistency in applying rules, de-escalation over confrontation, respect for expression with boundaries on conduct.'],
    ['The key question', 'Not “Do I agree with this message?” but whether the expression is consistent with policy and lets others keep speaking, listening, teaching, learning, and participating.'],
    ['Time, place, and manner', '48 hours’ notice when possible; three hours recommended, 7.5 at most; no blocking entrances, drowning out speakers, or disrupting classes.'],
    ['The staff role', 'Focus on conduct, not viewpoint. Know your escalation pathway, follow designated officials, avoid unnecessary escalation.']
  ];
  html += '<section class="ps-recap"><h2>What the course covered</h2><ol>' + RECAP.map(function(r, i){ return '<li><span class="ps-n">' + (i + 1) + '</span><span><b>' + esc(r[0]) + '.</b> ' + esc(r[1]) + '</span></li>'; }).join('') + '</ol></section>';
  html += '<section class="ps-row"><div class="ps-stat"><b>' + done + '/' + SECTIONS.length + '</b><span>activities complete</span></div><div class="ps-stat"><b>' + (score === null ? '&ndash;' : esc(score) + '/5') + '</b><span>quick check score</span></div><div class="ps-stat"><b>' + (get('myths-believed') === null ? '&ndash;' : esc(get('myths-believed')) + '/5') + '</b><span>myths I had believed</span></div></section>';
  html += '<section><h2>My one move</h2>' + (pick !== null ? '<p class="ps-sub">' + esc(CONSIDER[+pick] || '') + '</p>' : '') + '<p class="ps-write">' + (move ? esc(move) : '<span class="ps-empty">Not written yet. Lesson 6, from principle to practice.</span>') + '</p></section>';
  html += '<section><h2>Where we create open forums</h2><p class="ps-write">' + (forum ? esc(forum) : '<span class="ps-empty">Not written yet. Lesson 2, open forums.</span>') + '</p></section>';
  html += '<section><h2>My escalation pathway</h2><p class="ps-write">' + (E.name ? esc(E.name) + (E.phone ? ' &middot; ' + esc(E.phone) : '') + (E.email ? ' &middot; ' + esc(E.email) : '') : 'Contact: ______________________ &nbsp; Phone: ______________') + '</p></section>';
  html += '<section><h2>Keep these close</h2><table class="ps-table"><tbody>' + [['Freedom of Expression Policy', (C.links || {}).freedomOfExpression], ['Use of University Space', (C.links || {}).useOfSpace], ['Statement of Principles', (C.links || {}).principles], ['Community Creed', (C.links || {}).creed], ['Dialogue Vanderbilt', (C.links || {}).dialogue]].map(function(r){ return '<tr><th>' + esc(r[0]) + '</th><td>' + esc(r[1] || '') + '</td></tr>'; }).join('') + '</tbody></table><p class="ps-foot">A culture to sustain.</p></section>';
  sheet.innerHTML = html;
}
window.addEventListener('beforeprint', buildPrint);
document.addEventListener('click', function(e){
  if(!e.target.closest('[data-print]')) return;
  narrStop(); buildPrint();
  try{ window.print(); }catch(err){ toast('Printing is not available here. Use your browser menu to print.'); }
});

/* ══════════ copy to clipboard ══════════ */
$$('[data-copytext]').forEach(function(b){
  b.addEventListener('click', function(){
    var txt = b.getAttribute('data-copytext');
    var ok = function(){ var o = b.textContent; b.textContent = 'Copied'; setTimeout(function(){ b.textContent = o; }, 1600); };
    if(navigator.clipboard) navigator.clipboard.writeText(txt).then(ok, function(){ window.prompt('Copy this:', txt); });
    else window.prompt('Copy this:', txt);
  });
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
window.FE_COURSE = { SCENARIOS: SCENARIOS, QUIZ: QUIZ, DRILLS: DRILLS, MYTHS: MYTHS, TPM: TPM };
})();
