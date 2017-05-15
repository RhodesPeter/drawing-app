const DrawingAppDB = require('./db-connection');

const findAll = (cb) => {
  DrawingAppDB.find({}, (err, drawings) => {
    if (err) {
      return cb(err);
    }
    return cb(null, drawings);
  });
};

module.exports = findAll;
