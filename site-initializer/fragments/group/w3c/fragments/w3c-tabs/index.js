(function() {
  // Liferay invokes fragment JS once per fragment instance with `fragmentElement`
  // pointing at the fragment root. Fall back to a global query for non-Liferay envs.
  var root = (typeof fragmentElement !== 'undefined' && fragmentElement) ? fragmentElement : document;
  var container = root.querySelector ? root.querySelector('[data-tabs]') : null;
  if (!container && root.matches && root.matches('[data-tabs]')) container = root;
  if (!container) return;

  var tabs   = container.querySelectorAll('[role="tab"]');
  var panels = container.querySelectorAll('[role="tabpanel"]');

  function activate(tab) {
    Array.prototype.forEach.call(tabs, function(t) {
      t.setAttribute('aria-selected', 'false');
      t.setAttribute('tabindex', '-1');
    });
    Array.prototype.forEach.call(panels, function(p) { p.hidden = true; });
    tab.setAttribute('aria-selected', 'true');
    tab.setAttribute('tabindex', '0');
    var panel = container.querySelector('#' + tab.getAttribute('aria-controls'));
    if (panel) panel.hidden = false;
  }

  Array.prototype.forEach.call(tabs, function(tab) {
    tab.addEventListener('click', function() { activate(tab); tab.focus(); });
    tab.addEventListener('keydown', function(e) {
      var arr = Array.prototype.slice.call(tabs);
      var i = arr.indexOf(tab);
      var next;
      if (e.key === 'ArrowRight') next = arr[(i + 1) % arr.length];
      else if (e.key === 'ArrowLeft') next = arr[(i - 1 + arr.length) % arr.length];
      else if (e.key === 'Home') next = arr[0];
      else if (e.key === 'End')  next = arr[arr.length - 1];
      if (next) { e.preventDefault(); activate(next); next.focus(); }
    });
  });
})();
