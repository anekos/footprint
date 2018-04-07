
import Footprint from './footprint.js'

async function main () {

  function makeModifyOnClick (targetUrl) {
    async function onClick (e) {
      Footprint.debug('newPage/target', targetUrl);

      e.preventDefault();
      e.stopPropagation();

      let url = e.target.href;
      let title = e.target.textContent.trim();

      let target = await Footprint.getTarget(targetUrl);
      if (await Footprint.newPage(targetUrl)(url, title)) {
        await Footprint.notify('New page for ' + target.title);
      }
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

    let url = document.location.href;
    let value = await Footprint.getPage(url);

    if (!(value && value.targetUrl))
      return Promise.reject('No page data');

    window.hasRun = true;

    let targetUrl = value.targetUrl;

    Footprint.debug('install/target', targetUrl);

    let modifyOnClick = makeModifyOnClick(targetUrl);

    modifyOnClick(document.querySelector('body'));

    return Footprint.updateTitle(url, document.title);
  }

  install();

  browser.runtime.onMessage.addListener((message) => {
    if (message.command === 'footprint-install-content') {
      install();
    }
  });

}


main();
