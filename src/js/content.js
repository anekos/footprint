
import Footprint from './footprint.js'
import jQuery from 'jquery'

async function main () {

  function makeModifyOnClick (targetUrl) {
    async function onClick (e, element) {
      Footprint.debug('newPage/target', targetUrl);

      let pageTitle = element.textContent.trim();
      let pageUrl = element.href;

      if (!pageUrl.trim())
        return;

      let target = await Footprint.getTarget(targetUrl);
      let nextPage = target.pages.length + 1;
      if (await Footprint.newPage(targetUrl)(pageUrl, pageTitle)) {
        await Footprint.notify('New page (' + nextPage + ') for ' + target.title);
      }
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

    let pageUrl = document.location.href;
    let value = await Footprint.getPage(pageUrl);

    if (!(value && value.targetUrl))
      return Promise.reject('No page data');

    window.hasRun = true;

    let targetUrl = value.targetUrl;

    Footprint.debug('install/target', targetUrl);

    let modifyOnClick = makeModifyOnClick(targetUrl);

    modifyOnClick(document.querySelector('body'));

    return Footprint.updateTitle(targetUrl, pageUrl, document.title);
  }

  install();

  browser.runtime.onMessage.addListener((message) => {
    if (message.command === 'footprint-install-content') {
      install();
    }
  });

}


main();
