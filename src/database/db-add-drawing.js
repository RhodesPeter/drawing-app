const GoodGymDB = require('./db-connection');

const addRunToDB = (inputRun) => {
  let newRun = GoodGymDB({
    run: inputRun
  });

  newRun.save((err) => {
    if (err) throw err;
    console.log('Run created!');
  });
};

addRunToDB('drawing_1');

module.exports = addRunToDB;
