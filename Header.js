(function () {

  /* ── 1. SITE HEADER with live clock ─────────────── */
  var header = document.createElement('div');
  header.id = 'site-header';
  header.innerHTML =
    '<span class="header-title">Airon Tatrik \u2014 Portfolio</span>' +
    '<span class="header-clock" id="hclock"></span>';
  document.body.insertBefore(header, document.body.firstChild);

  function tick() {
    var n = new Date();
    var p = function (x) { return String(x).padStart(2, '0'); };
    document.getElementById('hclock').textContent =
      p(n.getHours()) + ':' + p(n.getMinutes()) + ':' + p(n.getSeconds());
  }
  tick();
  setInterval(tick, 1000);

  /* ── 2. PROGRAM WINDOW wrapping all page content ── */
  // Collect every node that isn't the site-header we just added
  var bodyNodes = Array.prototype.slice.call(document.body.childNodes).filter(
    function (n) { return n.id !== 'site-header'; }
  );

  // Build window structure
  var win = document.createElement('div');
  win.id = 'prog-window';

  var titlebar = document.createElement('div');
  titlebar.id = 'prog-window-titlebar';
  titlebar.innerHTML =
    '<span class="win-title">\uD83D\uDCC1 ' +
      (document.title || 'Program') +
    '</span>' +
    '<span class="win-controls">' +
      '<span class="wbtn">_</span>' +
      '<span class="wbtn">\u25A1</span>' +
      '<span class="wbtn">\u2715</span>' +
    '</span>';

  var body = document.createElement('div');
  body.id = 'prog-window-body';

  // Move existing content into the window body
  bodyNodes.forEach(function (node) {
    body.appendChild(node);
  });

  win.appendChild(titlebar);
  win.appendChild(body);
  document.body.appendChild(win);

})();