

export default (function () {
  function getTime() {
    return new Date().getTime();
  }

  let Footprint = {
    Name: {
      Page: function (url) {
        return 'page:' + url.replace(/^https?:\/\//g, '');
      }
    },

    /**
     * @return: true, if new page was added.
     */
    newPage: function (targetUrl) {
      return async (pageUrl, pageTitle) => {
        let value = await browser.storage.local.get({targets: {}});
        let target = value.targets[targetUrl];
        if (target) {
          if (target.pages.some((it) => it.url === pageUrl))
            return false;
          target.pages.push({
            url: pageUrl,
            title: pageTitle,
          });
          target.lastUpdatedAt = getTime();
          value[Footprint.Name.Page(pageUrl)] = {
            targetUrl: targetUrl,
          };
          await browser.storage.local.set(value);
          return true;
        } else {
          return Promise.reject('Target not found');
        }
      };
    },

    removePage: async (pageUrl) => {
      let page = await Footprint.getPage(pageUrl);
      let value = await browser.storage.local.get({targets: {}});
      let target = value.targets[page.targetUrl];
      target.pages = target.pages.filter((it) => it !== pageUrl);
      await browser.storage.local.set(value);
      return browser.storage.local.remove(pageUrl);
    },

    newTarget: async function (url, title, tags) {
      let value = await browser.storage.local.get({targets: {}});
      if (value.targets[url]) {
        return Promise.reject('Already bookmarked');
      }
      value.targets[url] = {
        title: title,
        pages: [],
        tags: tags,
      };
      await browser.storage.local.set(value);
      return Footprint.newPage(url)(url, title);
    },

    getTarget: async (url) => {
      let value = await browser.storage.local.get({targets: {}});
      return value.targets[url];
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
        return (b.lastUpdatedAt || 0) - (a.lastUpdatedAt || 0);
      });

      return targets;
    },

    getPage: async function (url) {
      let key = Footprint.Name.Page(url);
      let value = await browser.storage.local.get(key)
      return value[key];
    },

    updateTags: async function (targetUrl, tags) {
      let value = await browser.storage.local.get({targets: {}});
      let target = value.targets[targetUrl];
      if (target) {
        target.tags = tags;
        return browser.storage.local.set(value);
      } else {
        return false;
      }
    },

    updateTitle: async function (pageUrl, title) {
      let key = Footprint.Name.Page(pageUrl);
      let value = await browser.storage.local.get(key)
      let page = value[key];
      page.title = title;
      return browser.storage.local.set(value)
    },

    refreshTarget: async function (targetUrl, property) {
      let value = await browser.storage.local.get({targets: {}});
      let target = value.targets[targetUrl];
      if (target) {
        target[property] = getTime();
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
      if (chrome.notifications) {
        chrome.notifications.create({
          'type': 'basic',
          'iconUrl': chrome.extension.getURL('icons/64.png'),
          'title': 'Footprint',
          'message': message
        });
      } else {
        browser.runtime.sendMessage({'name': 'notify', 'message': message});
        console.log('footprint-notification: ' + message);
      }
    },

    debug: function (name, info) {
      console.log('Footprint/' + name + ': ' + JSON.stringify(info));
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
    },

    Helper: {
      extractTags: (targets) => {
        let tags = {};
        targets.forEach((target) => target.tags && target.tags.forEach((tag) => tags[tag] = true));
        return Object.keys(tags);
      },

      attachTagSet: (targets) => {
        targets.forEach((target) => {
          let set = {};
          target.tags.forEach((tag) => set[tag] = true);
          target.tagSet = set;
        });
      },
    },
  };


  return Footprint;
})();
