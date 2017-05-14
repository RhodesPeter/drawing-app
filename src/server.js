const hapi = require('hapi');

const server = new hapi.Server();

const port = process.env.PORT || 8000;

server.connection({
  port
});

server.register(require('inert'), (err) => {
  if (err) {
    throw err;
  }

  server.route({
    method: 'GET',
    path: '/{file*}',
    handler: {
      directory: {
        path: 'public'
      }
    }
  });
});

server.start(err => {
  if (err) throw err;
  console.log('Server is running on:', server.info.uri);
});
