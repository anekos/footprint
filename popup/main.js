
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
    withCurrentTab(function (tab) {
      Footprint.newTarget(tab.url, tab.title).then(function () {
        window.alert('Marked!');
      });
    });
  }
)

document.querySelector('#test').addEventListener(
  'click',
  function (ev) {
    withCurrentTab(function (tab) {
      var found = browser.storage.local.get(tab.url);
      found.then(function (value) {
        window.alert(JSON.stringify(value));
      })
    });
  }
)

document.querySelector('#open').addEventListener(
  'click',
  function (ev) {
    let win = window.open('../view/main.html', '_blank');
    win.focus();
    window.close();
  }
)

