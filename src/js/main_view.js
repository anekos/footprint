
import Vue from 'vue'
import Footprint from './footprint.js'
import Util from './util.js'


async function main() {
  let app = new Vue({
    el: '#app',
    data: {
      targets: [],
      tags: [],
    },
    methods: Util.Methods(),
  });

  let targets = await Footprint.targets();
  Footprint.Helper.attachTagSet(targets);
  app.targets = targets;
  app.tags = [null].concat(Footprint.Helper.extractTags(targets));

  targets.forEach((target, index) => {
    app.$watch('targets.' + index + '.tagSet', async (newVal, oldVal) => {
      await Footprint.updateTags(target.url, Util.trues(newVal));
    }, {
      deep: true
    });
  })
}


main();
