

Footprint = (function () {

  return {
    Name: {
      Page: function (url) {
        return 'page:' + url;
      }
    },

    newPage: function (targetUrl) {
      return function (pageUrl, pageTitle) {
        return browser.storage.local.get({targets: {}}).then(function (value) {
          let target = value.targets[targetUrl];
          if (target) {
            target.pages.push(pageUrl);
            value[Footprint.Name.Page(pageUrl)] = {
              title: pageTitle,
              target: targetUrl
            };
            return browser.storage.local.set(value);
          } else {
            return Promise.reject('Target not found');
          }
        });
      };
    },

    removePage: async (pageUrl) => {
      return browser.storage.local.remove(pageUrl);
    },

    newTarget: async function (url, title) {
      let value = await browser.storage.local.get({targets: {}});
      value.targets[url] = {title: title, pages: []};
      await browser.storage.local.set(value);
      return Footprint.newPage(url)(url, title);
    },

    targets: async function () {
      let value = await browser.storage.local.get({targets: {}});

      let targets = [];

      for (let url in value.targets) {
        let target = value.targets[url];
        target.url = url;
        targets.push(target);
      }

      targets.sort(function (a, b) {
        return (b.lastClickedAt || 0) - (a.lastClickedAt || 0);
      });

      return targets;
    },

    getPage: async function (url) {
      let key = Footprint.Name.Page(url);
      let value = await browser.storage.local.get(key)
      return value[key];
    },

    refreshTarget: async function (targetUrl) {
      let value = await browser.storage.local.get({targets: {}});
      let target = value.targets[targetUrl];
      if (target) {
        target.lastClickedAt = new Date().getTime();
        return browser.storage.local.set(value);
      } else {
        return false;
      }
    },

    removeTarget: async (targetUrl) => {
      let value = await browser.storage.local.get({targets: {}});
      let pages = value.targets[targetUrl].pages;
      delete value.targets[targetUrl];
      for (let page of pages) {
        await Footprint.removePage(page);
      }
      return browser.storage.local.set(value);
    },

    notify: function (message) {
      chrome.notifications.create({
        'type': 'basic',
        'iconUrl': chrome.extension.getURL('icons/64.png'),
        'title': 'Footprint',
        'message': message
      });
    },

    exportJson: async () => {
      let object = await browser.storage.local.get();
      return JSON.stringify(object, null, '  ');
    },

    importJson: async (json) => {
      await browser.storage.local.clear();
      return browser.storage.local.set(JSON.parse(json));
    },

    sendMessage: async (message, options) => {
      let query = {url: chrome.extension.getURL('*')};
      if (options) {
        Object.assign(query, options);
      }
      let tabs = await browser.tabs.query(query);
      for (let tab of tabs) {
        await browser.tabs.sendMessage(tab.id, message);
      }
    }
  };

})();
