const moment = require('moment');

module.exports = {
  ifCond: (a, b, options) => {
    if (a === b) {
      return options.fn(this);
    }
    return options.inverse(this);
  },
  moment: (a) => {
    return moment(a).fromNow();
  },
};
