
import Vue from 'vue'
import Footprint from './footprint.js'


async function main() {
  let app = new Vue({
    el: 'app',
    data: {
    }
  })

  let targets = await Footprint.targets();
  console.info(targets);
}


main();
