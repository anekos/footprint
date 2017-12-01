
Footprint.targets().then(function (targets) {
  let root = document.querySelector('#targets');

  for (let target of targets) {
    let li = document.createElement('li');
    li.setAttribute('data-target-url', target.url);
    let a = document.createElement('a');
    a.setAttribute('href', target.url);
    a.textContent = target.title || 'NO TITLE';
    li.appendChild(a);

    a.addEventListener(
      'click',
      function (e) {
        e.preventDefault();

        let pagesContainer = li.querySelector('.pages-container');
        if (pagesContainer) {
          return DOM.toggleDisplay(pagesContainer);
        }

        pagesContainer = document.createElement('ol');
        pagesContainer.setAttribute('class', 'pages-container');
        pagesContainer.setAttribute('reversed', 'reversed');

        async function addLinks () {
          let pages = target.pages.reverse();
          for (let pageUrl of pages) {
            let page = await Footprint.getPage(pageUrl);
            let pageElement = document.createElement('li');
            let pageLink = document.createElement('a');
            pageLink.setAttribute('href', pageUrl);
            pageLink.textContent = page.title || pageUrl;
            pageElement.appendChild(pageLink);
            pageLink.addEventListener(
              'click',
              () => Footprint.refreshTarget(target.url),
              false
            );
            pagesContainer.appendChild(pageElement);
          }

          li.appendChild(pagesContainer);
        };

        addLinks();
      },
      false
    );

    root.appendChild(li);
  }
});


browser.runtime.onMessage.addListener((message) => {
  ({
    'footprint-remove': async () => {
      let root = document.querySelector('#targets');
      let targets = root.querySelectorAll('li');

      if (message.confirmation) {
        if (!window.confirm('Remove: ' + message.name))
          return false;

        // if (window.confirm('Remove: ' + message.name)) {
        //   message.confirmation = false;
        //   await Footprint.sendMessage({command: 'footprint-refresh'}, false);
        //   console.log(message);
        // }
        // return;
      }

      for (let target of targets) {
        let name = target.textContent;
        if (target.getAttribute('data-target-url') == message.targetUrl) {
          (async () => {
            root.removeChild(target);
            await Footprint.removeTarget(message.targetUrl);
            await Footprint.notify('Remove: ' + name);
          })();
        }
      }
    },
    'footprint-refresh': () => {
      document.location.href = document.location.href;
    }
  }[message.command] || (() => false))();
});
