
import Footprint from './footprint.js'

function withCurrentTab(f) {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tabs) {
    var tab = tabs[0];
    f(tab);
  });
}

document.querySelector('#bookmark').addEventListener(
  'click',
  function (ev) {
    withCurrentTab(async (tab) => {
      try {
        await Footprint.newTarget(tab.url, tab.title);
        let result = await Footprint.sendMessage({command: 'footprint-install-content'}, {url: tab.url});
        Footprint.notify('New target: ' + (tab.title || tab.url));
        window.close();
      } catch (e) {
        window.alert(e);
      }
    });
  }
);

document.querySelector('#open').addEventListener(
  'click',
  function (ev) {
    let win = window.open('/html/main_view.html', '_blank');
    win.focus();
    window.close();
  }
);
