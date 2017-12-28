
console.log('Footprint');

browser.runtime.onMessage.addListener((command) => {
  if (command.name == 'notify') {
    Footprint.notify(command.message);
  }
});
