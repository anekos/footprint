

export default (function () {
  function getTime() {
    return new Date().getTime();
  }

  let Util = {
    trues: (object) => {
      let result = [];
      for (let key in object) {
        if (object[key])
          result.push(key);
      }
      return result;
    },

    Methods: (original) => {
      return Object.assign({}, original || {}, {
        id: (name, ...indices) => {
          return [name].concat(indices).join('-');
        },
      });
    }
  };

  return Util;
})();
