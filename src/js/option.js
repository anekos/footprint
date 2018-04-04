
import Footprint from './footprint.js'


async function main () {
  document.querySelector('a#export').addEventListener(
    'click',
    async (e) => {
      e.preventDefault();
      var text = await Footprint.exportJson();
      window.open('data:application/json,' + encodeURIComponent(text));
    },
    false
  );

  document.querySelector('input#import').addEventListener(
    'change',
    async (e) => {
      let file = e.target.files[0];
      let reader = new FileReader();
      reader.onload = async () => {
        await Footprint.importJson(reader.result);
        return Footprint.sendMessage({command: "footprint-refresh"});
      };
      reader.readAsText(file);
    },
    false
  );
}


main();
