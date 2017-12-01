(function() {
  async function install () {
    if (window.hasRun) {
      return;
    }
    window.hasRun = true;

    let url = document.location.href;
    let value = await Footprint.getPage(url);

    if (!(value && value.target))
      return Promise.reject('No page data');

    let target = value.target;

    let links = document.querySelectorAll('a');
    for (let link of links) {
      if (typeof link.href !== 'string')
        continue;

      link.addEventListener(
        'click',
        async (e) => {
          e.preventDefault();
          e.stopPropagation();

          await Footprint.newPage(target)(link.href, link.textContent.trim());
          document.location.href = link.href;
        },
        false
      );
    }

    return Footprint.updateTitle(url, document.title);
  }

  install();

  browser.runtime.onMessage.addListener((message) => {
    window.alert(message)
    if (message.command === 'footprint-install-content') {
      install();
    }
  });

})();

