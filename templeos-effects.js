/**
 * TempleOS Background Effects — Gutter Edition
 * Hard-clips both layers to the blue margin gutters via CSS clip-path.
 * Nothing can render over the content column regardless of spawn coords.
 */
(function () {
  'use strict';

  var C = {
    blue:'#0000AA', lblue:'#5555FF', red:'#AA0000', lred:'#FF5555',
    green:'#00AA00', lgreen:'#55FF55', cyan:'#00AAAA', lcyan:'#55FFFF',
    yellow:'#FFFF55', magenta:'#FF55FF',
  };

  var CONTENT_MAX = 1100;

  function bounds() {
    var vw = window.innerWidth;
    var w  = Math.min(vw, CONTENT_MAX);
    var l  = Math.max(0, (vw - w) / 2);
    return { l: l, r: l + w, vw: vw };
  }

  function gutterClip() {
    var b  = bounds();
    var l  = b.l.toFixed(1)  + 'px';
    var r  = b.r.toFixed(1)  + 'px';
    var vw = b.vw.toFixed(1) + 'px';
    if (b.l < 2 && b.r > b.vw - 2) return 'polygon(0 0, 0 0, 0 0)';
    return (
      'polygon(' +
        '0px 0px,'   + l + ' 0px,' +
        l + ' 100%,' + '0px 100%,' +
        '0px 0px,'   +
        r + ' 0px,'  + vw + ' 0px,' +
        vw + ' 100%,' + r + ' 100%,' +
        r + ' 0px' +
      ')'
    );
  }

  function applyClip() {
    var cp = gutterClip();
    canvas.style.clipPath  = cp;
    overlay.style.clipPath = cp;
  }

  /* ── CANVAS ─────────────────────────────────────── */
  var canvas = document.createElement('canvas');
  canvas.id = 'effects-canvas';
  canvas.style.cssText = [
    'position:fixed','top:0','left:0','width:100%','height:100%',
    'pointer-events:none','z-index:9990','opacity:0.28','mix-blend-mode:screen',
  ].join(';');
  document.body.appendChild(canvas);
  var ctx = canvas.getContext('2d');

  /* ── OVERLAY ─────────────────────────────────────── */
  var overlay = document.createElement('div');
  overlay.id = 'effects-overlay';
  overlay.style.cssText = [
    'position:fixed','top:0','left:0','width:100%','height:100%',
    'pointer-events:none','z-index:9991','overflow:hidden',
    'font-family:Courier New,Courier,monospace',
  ].join(';');
  document.body.appendChild(overlay);

  /* ── SIZE ────────────────────────────────────────── */
  var W, H, drops;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    var b = bounds();
    drops = [];
    for (var x = 0; x < W; x += 10) {
      if (x + 10 <= b.l || x >= b.r) drops.push({ x: x, y: Math.random() * H });
    }
    applyClip();
  }
  resize();
  window.addEventListener('resize', resize);

  /* ── HELPERS ─────────────────────────────────────── */
  function rnd(a, b2)  { return a + Math.random() * (b2 - a); }
  function pick(arr)   { return arr[Math.floor(Math.random() * arr.length)]; }
  function rndCol()    { var k=Object.keys(C); return C[k[Math.floor(Math.random()*k.length)]]; }
  function hex(n)      { var s=''; for(var i=0;i<n;i++) s+='0123456789ABCDEF'[Math.floor(Math.random()*16)]; return s; }
  function bin(n)      { var s=''; for(var i=0;i<n;i++) s+=(Math.random()>.5?'1':'0'); return s; }

  function gutterX() {
    var b = bounds(), opts = [];
    if (b.l > 10)        opts.push(function(){ return rnd(0,   b.l); });
    if (b.vw - b.r > 10) opts.push(function(){ return rnd(b.r, b.vw); });
    if (!opts.length) return rnd(0, b.vw);
    return pick(opts)();
  }

  /* ── CONTENT ─────────────────────────────────────── */
  var PHRASES = [
    'GOD IS REAL','TEMPLEOS v5.03','HE TALKED TO ME',
    'RING 0 ACCESS GRANTED','HOLY C COMPILER','640x480 VGA',
    'SOUL ETERNAL','NO PAGING','SINGLE TASKING','TERRY A. DAVIS',
    'HEAR ME LORD','GLORY TO GOD','KERNEL PANIC? NEVER.',
    'ACT OF GOD','AMEN','CS:IP OVERFLOW','DIVINE INTERRUPT',
    'INT 0x80','THE TEMPLE IS BUILT','BEHOLD','WRATH INCOMING',
    '>>> REVELATION <<<','RAM: INFINITE (GOD)','FAT32 IS HOLY',
  ];
  var SYMS = ['✝','☩','✡','☯','⛧','⚡','◈','█','▓','░','▒','◄','►','▲','▼'];

  /* ── SPAWN WORD ──────────────────────────────────── */
  function spawnWord(text, opts) {
    opts = opts || {};
    var size = opts.size    != null ? opts.size    : Math.floor(rnd(9,16));
    var col  = opts.color   || rndCol();
    var dur  = opts.dur     != null ? opts.dur     : rnd(3000,9000);
    var op   = opts.opacity != null ? opts.opacity : rnd(0.35,0.8);
    var x    = opts.x != null ? opts.x : gutterX();
    var y    = opts.y != null ? opts.y : rnd(0, H - 30);

    var el = document.createElement('div');
    el.textContent = text;
    el.style.cssText = [
      'position:absolute',
      'left:' + x + 'px', 'top:' + y + 'px',
      'font-size:' + size + 'px', 'color:' + col,
      'white-space:nowrap', 'opacity:0',
      'transition:opacity 0.4s', 'letter-spacing:2px',
      'text-shadow:0 0 6px ' + col, 'font-weight:bold',
    ].join(';');
    overlay.appendChild(el);
    requestAnimationFrame(function () { el.style.opacity = op; });
    if (opts.fade !== false) {
      setTimeout(function () {
        el.style.opacity = '0';
        setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 500);
      }, dur);
    }
    return el;
  }

  /* ── PHRASES ─────────────────────────────────────── */
  function spawnPhrase() {
    var t = Math.random(), text;
    if      (t < 0.35) text = pick(PHRASES);
    else if (t < 0.55) text = '0x' + hex(8);
    else if (t < 0.70) text = bin(Math.floor(rnd(8,20)));
    else if (t < 0.80) text = pick(SYMS).repeat(Math.floor(rnd(1,4)));
    else if (t < 0.90) text = 'ERR:' + hex(4) + ' ' + pick(PHRASES).slice(0,10);
    else               text = pick('012'.split('')).repeat(Math.floor(rnd(5,14)));
    spawnWord(text);
  }
  setInterval(spawnPhrase, 700);

  /* ── MATRIX RAIN ─────────────────────────────────── */
  var RAIN = (
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' +
    '+-*/=<>!?@#$%^&()[]{}|;:,.ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθ✝☩▓▒░█▄▀■□◆◇'
  ).split('');
  var scrollV = 0;

  function drawRain() {
    var b = bounds();
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    if (b.l > 0)     ctx.fillRect(0,   0, b.l,        H);
    if (b.r < b.vw)  ctx.fillRect(b.r, 0, b.vw - b.r, H);
    var speed = 1 + scrollV * 3;
    ctx.font = '10px Courier New';
    for (var i = 0; i < drops.length; i++) {
      var d = drops[i];
      ctx.fillStyle = (i%3===0)?C.lgreen:(i%3===1)?C.lcyan:C.yellow;
      ctx.fillText(pick(RAIN), d.x, d.y);
      if (d.y > H && Math.random() > 0.975) d.y = 0;
      d.y += speed;
    }
    scrollV *= 0.92;
  }

  /* ── GLITCH BURST ────────────────────────────────── */
  function glitchBurst() {
    var ox = gutterX(), oy = rnd(80, H - 80);
    var n  = Math.floor(rnd(4,10));
    for (var i = 0; i < n; i++) {
      (function(d){ setTimeout(function(){
        spawnWord(Math.random()<0.5?'0x'+hex(4):pick(PHRASES).slice(0,Math.floor(rnd(4,10))), {
          x: ox+rnd(-50,50), y: oy+rnd(-50,50),
          size: Math.floor(rnd(10,20)), dur: rnd(400,1200),
          color: Math.random()<0.5?C.lred:C.yellow, opacity: rnd(0.6,1),
        });
      }, d); })(i*60);
    }
  }

  /* ── HOLY BURST ──────────────────────────────────── */
  function holyBurst() {
    var cx = gutterX(), cy = rnd(80, H-80), sym = pick(SYMS), n = 6;
    for (var r = 0; r < n; r++) {
      (function(i){ setTimeout(function(){
        var a = (i/n)*Math.PI*2;
        spawnWord(sym, {
          x: cx+Math.cos(a)*rnd(20,55), y: cy+Math.sin(a)*rnd(20,55),
          size: Math.floor(rnd(12,22)), dur: rnd(600,1800),
          color: pick([C.yellow,C.lcyan,C.magenta]), opacity: 0.8,
        });
      }, i*80); })(r);
    }
  }

  /* ── BINARY STRIP ────────────────────────────────── */
  function spawnBinaryStrip() {
    var b = bounds();
    function makeStrip(lx, ww) {
      if (ww < 20) return;
      var el = document.createElement('div'), s = '';
      for (var i = 0; i < 180; i++) s += (Math.random()>.5?'1':'0')+' ';
      el.textContent = s;
      el.style.cssText = [
        'position:absolute','left:'+lx+'px','top:'+rnd(0,H)+'px',
        'width:'+ww+'px','overflow:hidden','font-size:10px',
        'color:'+pick([C.lgreen,C.lcyan,C.blue]),
        'opacity:0.45','white-space:nowrap','letter-spacing:1px','pointer-events:none',
      ].join(';');
      overlay.appendChild(el);
      setTimeout(function(){ if(el.parentNode)el.parentNode.removeChild(el); }, rnd(2000,5000));
    }
    makeStrip(0,       b.l - 4);
    makeStrip(b.r + 4, b.vw - b.r - 4);
  }
  function scheduleBinary() {
    setTimeout(function(){ spawnBinaryStrip(); scheduleBinary(); }, rnd(2500,6000));
  }
  scheduleBinary();

  /* ── SCROLL ──────────────────────────────────────── */
  var lastY = window.scrollY, scrollTO;
  window.addEventListener('scroll', function () {
    var dy = Math.abs(window.scrollY - lastY);
    lastY = window.scrollY;
    scrollV = Math.min(scrollV + dy*0.08, 12);
    if (dy > 30) spawnWord(pick(PHRASES), {
      size: Math.floor(rnd(14,22)), color: C.lred, dur: rnd(800,2000), opacity: rnd(0.5,0.85),
    });
    clearTimeout(scrollTO);
    scrollTO = setTimeout(function(){ if(Math.random()<0.55) glitchBurst(); }, 150);
  });

  /* ── SPONTANEOUS ─────────────────────────────────── */
  function sched(fn, lo, hi) { setTimeout(function(){ fn(); sched(fn,lo,hi); }, rnd(lo,hi)); }
  sched(holyBurst,    7000,  20000);
  sched(glitchBurst, 12000,  30000);
  sched(function(){
    spawnWord('■■ EXCEPTION 0x'+hex(4)+' ■■',
      { size: Math.floor(rnd(14,24)), color: C.lred, dur: rnd(700,1600), opacity: 0.9 });
  }, 15000, 40000);

  /* ── LOOP ────────────────────────────────────────── */
  function loop(){ drawRain(); requestAnimationFrame(loop); }
  loop();

})();