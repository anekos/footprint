

DOM = (function () {
  return {
    toggleDisplay: function (e) {
      if (e.style.display === 'none') {
        e.style.display = 'block';
      } else {
        e.style.display = 'none';
      }
    },

    toggleClass: (e, on, off) => {
      let klass = e.getAttribute('class', '').trim();
      let items = klass.split(/\s+/);
      let notOn = items.filter((it) => it !== on);
      let newItem = notOn.length == items.length ? on : off;
      items = items.filter((it) => it !== on && it !== off)
      items.push(newItem);
      e.setAttribute('class', items.join(' '));
    }
  };
})();
