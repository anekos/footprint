
import jQuery from 'jquery'

import Footprint from './footprint'



async function main () {

  function makeModifyOnClick (targetUrl) {
    async function onClick (pageUrl, pageTitle) {
      Footprint.debug('newPage/target', targetUrl);

      if (!pageUrl.trim())
        return;

      browser.runtime.sendMessage(
        {
          name: 'newPage',
          targetUrl,
          pageUrl,
          pageTitle,
        }
      );
    };

    return function modifyOnClick (root) {
      root.addEventListener('click', (e) => {
        let found = jQuery(e.target).closest('a')[0];
        if (found && typeof found.href === 'string') {
          return onClick(found.href.toString(), found.textContent.trim());
        }
      }, false);
    };
  }

  function installPositionSaver(pageUrl) {
    window.addEventListener('beforeunload', (e) => {
      let position = {
        x: window.pageXOffset,
        y: window.pageYOffset,
      };
      browser.runtime.sendMessage(
        {
          name: 'savePosition',
          pageUrl,
          position,
        }
      );
    });
  }

  async function install () {
    if (window.hasRun) {
      return;
    }

    let pageUrl = document.location.href;
    let page = await Footprint.getPage(pageUrl);

    if (!(page && page.targetUrl))
      return Promise.reject('No page data');

    if (page.position)
      window.scrollTo(page.position.x, page.position.y);

    window.hasRun = true;

    let targetUrl = page.targetUrl;

    Footprint.debug('install/target', targetUrl);

    let modifyOnClick = makeModifyOnClick(targetUrl);

    modifyOnClick(document.querySelector('body'));

    installPositionSaver(pageUrl);

    return Footprint.updatePageTitle(targetUrl, pageUrl, document.title);
  }

  install();

  browser.runtime.onMessage.addListener((message) => {
    if (message.command === 'footprint-install-content') {
      install();
    }
  });

}

main();
