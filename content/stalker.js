(function() {
  async function install () {
    if (window.hasRun) {
      return;
    }
    window.hasRun = true;

    let value = await Footprint.getPage(document.location.href);

    if (!(value && value.target))
      return Promise.reject('No page data');

    let target = value.target;

    let links = document.querySelectorAll('a');
    for (let link of links) {
      if (typeof link.href !== 'string')
        continue;

      link.addEventListener(
        'click',
        function (e) {
          e.preventDefault();
          e.stopPropagation();

          Footprint.newPage(target)(link.href, link.textContent.trim()).then(function () {
            document.location.href = link.href;
          });
        },
        false
      );
    }
  }

  install();

  browser.runtime.onMessage.addListener((message) => {
    window.alert(message)
    if (message.command === 'footprint-install-content') {
      install();
    }
  });

})();

