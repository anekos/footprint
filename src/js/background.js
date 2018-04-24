
import Footprint from './footprint'


function notify(message) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: chrome.extension.getURL('icons/64.png'),
    title: 'Footprint',
    message,
  });
}



const Actions = {
  notify: async command => notify(command.message),

  newPage: async command => {
    let target = await Footprint.getTarget(command.targetUrl);
    if (!target)
      return;

    let nextPage = target.pages.length + 1;

    if (await Footprint.newPage(command.targetUrl)(command.pageUrl, command.pageTitle)) {
      notify('New page (' + nextPage + ') for ' + target.title);
    }
  },
};


function main () {
  browser.runtime.onMessage.addListener(command => {
    let action = Actions[command.name];
    if (action)
      action(command)
  });
}


console.log('Footprint: background.js');


main();
