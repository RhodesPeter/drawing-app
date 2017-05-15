const postDrawing = require('./database/db-add-drawing.js');
const findAll = require('./database/db-find-all.js');

module.exports = [
  {
    method: 'GET',
    path: '/{file*}',
    handler: {
      directory: {
        path: 'public'
      }
    }
  },
  {
    method: 'POST',
    path: '/post-drawing',
    handler: (request, reply) => {
      const drawing = request.payload;
      postDrawing(drawing, function (err, info) {
        if (err) {
          console.log(err);
          reply({status: 'drawing not posted'});
        } else {
          console.log('info:', info);
          reply({status: 'drawing posted'});
        }
      });
    }
  },
  {
    method: 'Get',
    path: '/get-drawings',
    handler: (request, reply) => {
      findAll(function (err, info) {
        if (err) {
          console.log(err);
          reply({status: 'drawings not retrieved'});
        } else {
          console.log('info:', info);
          reply({status: 'drawing retrieved', drawings: info});
        }
      });
    }
  }
];
