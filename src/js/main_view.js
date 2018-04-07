
import Vue from 'vue'
import Footprint from './footprint.js'
import Util from './util.js'
import UI from './ui_common.js'


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
    },
    computed: {
      tags: function () {
        let result = this.realTags.map(tag => ({name: tag, isIn: (tags) => tags.includes(tag), real: true}));
        return result.concat(this.pseudoTags || []);
      }
    },
    methods: Util.Methods(),
  });

  targets.forEach((target, index) => {
    app.$watch('targets.' + index + '.tags', async (newVal, oldVal) => {
      await Footprint.updateTags(target.url, newVal);
    }, {
      deep: true
    });
  });

  document.querySelector('#new-tag-button').addEventListener(
    'click',
    () => {
      let element = document.querySelector('#new-tag-name');
      if (element) {
        let name = element.value.trim();
        if (name.length) {
          app.realTags.push(name);
          element.value = '';
        }
      }
    });

  UI.setupNewTagButton(app);
}


main();
