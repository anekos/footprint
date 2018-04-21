
import Vue from 'vue'
import Footprint from './footprint.js'
import Util from './util.js'


async function main() {
  let tab = await browser.tabs.query({active: true, currentWindow: true}).then(tabs => tabs[0]);

  let targets = await Footprint.targets();

  let app = new Vue({
    el: '#app',
    data: {
      tags: Footprint.Helper.extractTags(targets),
      checked: {},
      methods: Util.Methods(),
      newTagName: '',
      title: tab.title,
    },
    methods: {
      addNewTag: function () {
        if (this.tags.includes(this.newTagName) || !this.newTagName.length)
          return;
        this.tags.push(this.newTagName);
        this.checked[this.newTagName] = true;
        this.newTagName = '';
      },
      addBookmark: async function () {
        try {
          let title = this.title;
          let tags = Util.trues(app.checked);

          await Footprint.newTarget(tab.url, title, tags);

          await Footprint.sendMessage({command: 'footprint-install-content'}, {url: tab.url});
          Footprint.notify('New target: ' + (title || tab.url));

          window.close();
        } catch (e) {
          window.alert(e);
        }
      },
      showBookmarks: () => {
        chrome.tabs.create({
          url: chrome.extension.getURL('html/main_view.html'),
          active: true,
        });
        window.close();
      }
    }
  });
}


main();
