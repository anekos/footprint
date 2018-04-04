
import Footprint from './footprint.js'


function main() {
  browser.runtime.onMessage.addListener((command) => {
    if (command.name == 'notify') {
      Footprint.notify(command.message);
    }
  });
}


main();
