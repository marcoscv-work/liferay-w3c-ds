(function() {
  var root = (typeof fragmentElement !== 'undefined' && fragmentElement) ? fragmentElement : document;
  var header = root.querySelector ? root.querySelector('[data-w3c-header]') : null;
  if (!header && root.matches && root.matches('[data-w3c-header]')) header = root;
  if (!header) return;

  var openBtn  = header.querySelector('[data-trigger="mobile-nav"]');
  var closeEls = header.querySelectorAll('[data-trigger="mobile-nav-close"]');
  var panel    = header.querySelector('.global-nav__panel');
  if (!openBtn || !panel) return;

  function open() {
    panel.classList.add('global-nav__panel--open');
    openBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('has-mobile-nav-open');
    var first = panel.querySelector('a, button');
    if (first) first.focus();
  }
  function close() {
    panel.classList.remove('global-nav__panel--open');
    openBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('has-mobile-nav-open');
    openBtn.focus();
  }

  openBtn.addEventListener('click', function() {
    if (panel.classList.contains('global-nav__panel--open')) close(); else open();
  });
  Array.prototype.forEach.call(closeEls, function(el) {
    el.addEventListener('click', close);
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && panel.classList.contains('global-nav__panel--open')) close();
  });
})();
