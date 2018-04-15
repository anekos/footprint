
import Vue from 'vue'
import Bootstrap from 'bootstrap'
import JQuery from 'jquery'
import Footprint from './footprint.js'
import Util from './util.js'

import draggable from 'vuedraggable'


async function main() {
  let targets = await Footprint.targets();
  let config = await Footprint.getConfig();
  let realTags = Footprint.Helper.extractTags(targets, config.tagOrder);

  targets.forEach(target => {
    target.newTags = [].concat(target.tags);
  });
  targets.sort((a, b) => b.lastUpdatedAt - a.lastUpdatedAt);

  let state = (() => {
    let values = window.location.hash.replace(/^#/, '').split('-');
    let tag = parseInt(values[0]) || 0;
    let target = parseInt(values[1]);
    if (isNaN(target))
      target = undefined;
    if (realTags.length + 2 <= tag)
      tag = 0;
    return {tag, target};
  })();


  let app = new Vue({
    el: '#app',
    components: {
      draggable,
    },
    data: {
      targets,
      realTags: realTags,
      pseudoTags: [
        {name: 'NONE', isIn: tags => tags.length == 0},
        {name: 'ALL', isIn: _ => true},
      ],
      newTagName: '',
      tagNameToRemove: [],
      fileToImport: null,
      state,
    },
    computed: {
      tags: function () {
        let result = this.realTags.map(tag => ({name: tag, isIn: (tags) => tags.includes(tag), real: true}));
        return result.concat(this.pseudoTags || []);
      }
    },
    methods: Util.Methods({
      updateTags: async function (target) {
        target.tags = [].concat(target.newTags);
        await Footprint.updateTags(target.url, target.tags);
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
      },
      removeTags: async function () {
        await Footprint.removeTags(this.tagNameToRemove);
        let targets = await Footprint.targets();
        this.targets = targets;
        this.realTags = Footprint.Helper.extractTags(targets);
        this.tagNameToRemove = [];
      },
      selectFileToImport: async function (e) {
        let files = e.target.files;
        this.fileToImport = files[0];
      },
      importBookmarks: async function () {
        let reader = new FileReader();
        reader.onload = async () => {
          await Footprint.importJson(reader.result);
          document.location.href = document.location.href;
        };
        reader.readAsText(this.fileToImport);
        this.fileToImport = null;
      },
      exportBookmarks: async () => {
        var text = await Footprint.exportJson();
        window.open('data:application/json,' + encodeURIComponent(text));
      },
      updateTagOrder: async function () {
        config.tagOrder = this.realTags.concat([]);
        await Footprint.updateConfig(config);
      },
      updateLocationHash: function (name, value) {
        this.state[name] = value;
        let hash = [this.state.tag, this.state.target];
        window.location.hash = hash.join('-');
      }
    }),
  });

  JQuery(Util.id('#tab', state.tag)).addClass('active');
  JQuery(Util.id('#tab-link', state.tag)).addClass('active');
  if (typeof state.target !== 'undefined') {
    JQuery(Util.id('#target', state.tag, state.target)).addClass('show');
  }

}


main();
