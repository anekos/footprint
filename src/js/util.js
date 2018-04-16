
import strictArrayEquals from 'strict-array-equals'
import DateFormat from 'dateformat'


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

    id: (name, ...indices) => {
      return [name].concat(indices).join('-');
    },

    Methods: (original) => {
      return Object.assign({}, Util, original || {}, {
        arrayEq: strictArrayEquals,
        dateFormat: DateFormat,
      });
    }
  };

  return Util;
})();
