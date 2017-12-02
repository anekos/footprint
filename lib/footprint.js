

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
    }
  };

})();
