
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

        async function addLinks () {
          for (let pageUrl of target.pages) {
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
  if (message.command === "footprint-remove") {
    let root = document.querySelector('#targets');
    let targets = root.querySelectorAll('li');

    for (let target of targets) {
      let name = target.textContent;
      if (target.getAttribute('data-target-url') == message.targetUrl && window.confirm('Remove: ' + name)) {
        (async () => {
          root.removeChild(target);
          await Footprint.removeTarget(message.targetUrl);
          await Footprint.notify('Remove: ' + name);
        })();
      }
    }
  }
});
