
import Vue from 'vue'
import Footprint from './footprint.js'
import Util from './util.js'


async function main() {
  function withCurrentTab(f) {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs) {
      var tab = tabs[0];
      f(tab);
    });
  }

  let app = new Vue({
    el: '#app',
    data: {
      tags: [],
      checked: {},
      methods: Util.Methods(),
    }
  });

  let targets = await Footprint.targets();
  app.tags = Footprint.Helper.extractTags(targets);

  document.querySelector('#add-bookmark').addEventListener(
    'click',
    function (ev) {
      withCurrentTab(async (tab) => {
        try {
          let tags = Util.trues(app.checked);
          await Footprint.newTarget(tab.url, tab.title, tags);

          await Footprint.sendMessage({command: 'footprint-install-content'}, {url: tab.url});
          Footprint.notify('New target: ' + (tab.title || tab.url));

          window.close();
        } catch (e) {
          window.alert(e);
        }
      });
    }
  );

  document.querySelector('#open').addEventListener(
    'click',
    function (ev) {
      let win = window.open('/html/main_view.html', '_blank');
      win.focus();
      window.close();
    }
  );

}


main();
