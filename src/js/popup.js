
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

  let targets = await Footprint.targets();

  let app = new Vue({
    el: '#app',
    data: {
      tags: Footprint.Helper.extractTags(targets),
      checked: {},
      methods: Util.Methods(),
      newTagName: '',
    },
    methods: {
      addNewTag: function () {
        if (this.tags.includes(this.newTagName) || !this.newTagName.length)
          return;
        this.tags.push(this.newTagName);
        this.checked[this.newTagName] = true;
        this.newTagName = '';
      },
      addBookmark: () => {
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
      },
      showBookmarks: () => {
        let win = window.open('/html/main_view.html', '_blank');
        win.focus();
        window.close();
      }
    }
  });
}


main();
