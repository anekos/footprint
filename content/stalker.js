(function() {

  function makeModifyOnClick (target) {
    function makeOnClick (link) {
      return async function onClick (e) {
        e.preventDefault();
        e.stopPropagation();

        Footprint.debug('newPage/target', target);

        await Footprint.newPage(target)(link.href, link.textContent.trim());
        document.location.href = link.href;
      };
    }

    return function modifyOnClick (root) {
      let links = root.querySelectorAll('a');
      for (let link of links) {
        if (typeof link.href !== 'string')
          continue;
        let onClick = makeOnClick(link);
        link.addEventListener('click', onClick, false);
      }
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

    modifyOnClick(document);

    var observer = new MutationObserver((records, observer) => {
      Footprint.debug('install/MutationObserver', target);
      records.forEach((it) => {
        modifyOnClick(it.target);
      })
    });

    observer.observe(document.querySelector('body'), {
      childList: true,
    });

    return Footprint.updateTitle(url, document.title);
  }

  install();

  browser.runtime.onMessage.addListener((message) => {
    if (message.command === 'footprint-install-content') {
      install();
    }
  });

})();

