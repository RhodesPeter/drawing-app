const hapi = require('hapi');
const server = new hapi.Server();
const port = process.env.PORT || 8000;
const routes = require('./routes');

server.connection({
  port
});

server.register(require('inert'), (err) => {
  if (err) {
    throw err;
  }

  server.route(routes);
});

module.exports = server;
