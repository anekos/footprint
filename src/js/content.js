
import Footprint from './footprint.js'
import jQuery from 'jquery'

async function main () {

  function makeModifyOnClick (targetUrl) {
    async function onClick (e, element) {
      Footprint.debug('newPage/target', targetUrl);

      e.preventDefault();
      e.stopPropagation();

      let title = element.textContent.trim();
      let url = element.href;

      let target = await Footprint.getTarget(targetUrl);
      if (await Footprint.newPage(targetUrl)(url, title)) {
        await Footprint.notify('New page for ' + target.title);
      }
      document.location.href = url;
    };

    return function modifyOnClick (root) {
      root.addEventListener('click', (e) => {
        let found = jQuery(e.target).closest('a')[0];
        if (found && typeof found.href === 'string') {
          return onClick(e, found);
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
