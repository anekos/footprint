
export default (function () {
  return {
    setupNewTagButton: (app) => {
      document.querySelector('#new-tag-button').addEventListener(
        'click',
        () => {
          let element = document.querySelector('#new-tag-name');
          if (element) {
            let name = element.value.trim();
            if (name.length) {
              (app.pseudoTags ? app.realTags : app.tags).push(name);
              element.value = '';
            }
          }
        });
    }
  };
})();
