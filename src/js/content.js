
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

    return Footprint.updatePage(targetUrl, pageUrl, document.title);
  }

  install();

  browser.runtime.onMessage.addListener((message) => {
    if (message.command === 'footprint-install-content') {
      install();
    }
  });

}


main();
