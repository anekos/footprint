
import Footprint from './footprint.js'


const Actions = {
  notify: async command => {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: chrome.extension.getURL('icons/64.png'),
      title: 'Footprint',
      message: command.message
    });
  },

  newPage: async command => {
    let target = await Footprint.getTarget(command.targetUrl);
    if (!target)
      return;

    let nextPage = target.pages.length + 1;

    if (await Footprint.newPage(command.targetUrl)(command.pageUrl, command.pageTitle)) {
      await Footprint.notify('New page (' + nextPage + ') for ' + target.title);
    }
  },
}


function main() {
  browser.runtime.onMessage.addListener(command => {
    console.log('message', command);
    let action = Actions[command.name];
    if (action)
      action(command)
  });
}


console.log('Footprint: background.js');


main();
