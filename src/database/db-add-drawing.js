const DrawingAppDB = require('./db-connection');

const addDrawingToDB = (inputDrawing, cb) => {
  let newDrawing = DrawingAppDB({
    drawing: inputDrawing
  });

  newDrawing.save((err) => {
    if (err) {
      return cb(err);
    }
    console.log('Drawing saved!');
    return cb(null, inputDrawing);
  });
};

module.exports = addDrawingToDB;
