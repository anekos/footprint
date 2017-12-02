(function() {
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;

  Footprint.getPage(document.location.href).then(function (value) {
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

          console.log(JSON.stringify(target));
          Footprint.newPage(target)(link.href, link.textContent).then(function () {
            document.location.href = link.href;
          });
        },
        false
      );
    }

    return Promise.resolve(true);
  });

  browser.runtime.onMessage.addListener((message) => {
    if (message.command === "meow") {
      // DO SOMETHING
    }
  });

})();

