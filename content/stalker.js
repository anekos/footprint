(function() {

  function makeModifyOnClick (target) {
    async function onClick (e) {
      Footprint.debug('newPage/target', target);

      e.preventDefault();
      e.stopPropagation();

      let url = e.target.href;
      let title = e.target.textContent.trim();

      await Footprint.newPage(target)(url, title);
      document.location.href = url;
    };

    return function modifyOnClick (root) {
      root.addEventListener('click', (e) => {
        if (e.target.tagName === 'A' && typeof e.target.href === 'string') {
          return onClick(e);
        }
      }, false);
    };
  }

  async function install () {
    if (window.hasRun) {
      return;
    }
    window.hasRun = true;

    let url = document.location.href;
    let value = await Footprint.getPage(url);

    if (!(value && value.target))
      return Promise.reject('No page data');

    let target = value.target;

    Footprint.debug('install/target', target);

    let modifyOnClick = makeModifyOnClick(target);

    modifyOnClick(document.querySelector('body'));

    return Footprint.updateTitle(url, document.title);
  }

  install();

  browser.runtime.onMessage.addListener((message) => {
    if (message.command === 'footprint-install-content') {
      install();
    }
  });

})();

