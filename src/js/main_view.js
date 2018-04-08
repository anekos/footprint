
import Vue from 'vue'
import Bootstrap from 'bootstrap'
import Footprint from './footprint.js'
import Util from './util.js'


async function main() {
  let targets = await Footprint.targets();

  let app = new Vue({
    el: '#app',
    data: {
      targets: targets,
      realTags: Footprint.Helper.extractTags(targets),
      pseudoTags: [
        {name: 'NONE', isIn: tags => tags.length == 0},
        {name: 'ALL', isIn: _ => true},
      ],
      newTagName: '',
    },
    computed: {
      tags: function () {
        let result = this.realTags.map(tag => ({name: tag, isIn: (tags) => tags.includes(tag), real: true}));
        return result.concat(this.pseudoTags || []);
      }
    },
    methods: Util.Methods({
      updateTags: async function (target) {
        await Footprint.updateTags(target.url, target.tags);
        app.$set(target, 'tagsUpdated', false);
      },
      removePage: async function (target, page, pageIndex) {
        if (!confirm('Remove this page? (' + page.title + ')'))
          return;
        await Footprint.removePage(page.url);
        target.pages.splice(pageIndex, 1);
      },
      removeTarget: async function (target, targetIndex) {
        if (!confirm('Delete this bookmark? (' + target.title + ')'))
          return;
        await Footprint.removeTarget(target.url);
        app.targets.splice(targetIndex, 1);
      },
      addNewTag: function () {
        if (this.realTags.includes(this.newTagName) || !this.newTagName.length)
          return;
        this.realTags.push(this.newTagName);
        this.newTagName = '';
      }
    }),
  });
}


main();
