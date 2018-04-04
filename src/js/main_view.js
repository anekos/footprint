
import Vue from 'vue'
import Footprint from './footprint.js'


async function main() {
  let app = new Vue({
    el: '#app',
    data: {
      targets: [],
      tags: [],
    }
  });

  let targets = await Footprint.targets();
  Footprint.Helper.attachTagSet(targets);
  app.targets = targets;
  app.tags = [null].concat(Footprint.Helper.extractTags(targets));
}


main();
