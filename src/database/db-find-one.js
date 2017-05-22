const DrawingAppDB = require('./db-connection');

const findOneRun = (drawingName) => {
  DrawingAppDB.findOne({drawing: drawingName}, (err, drawing) => {
    if (err) throw err;
    console.log(drawing);
  });
};

findOneRun('drawing-name');

module.exports = findOneRun;
