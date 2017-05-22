const hapi = require('hapi');
const server = new hapi.Server();
const routes = require('./routes');
const Path = require('path');
const Inert = require('inert');
const Vision = require('vision');

const port = process.env.PORT || 8000;

server.connection({
  port
});

server.register([Inert, Vision], err => {
  if (err) { console.log(err); }

  server.views({
    engines: {
      hbs: require('handlebars')
    },
    relativeTo: Path.join(__dirname, '..', 'src', 'templates'),
    layoutPath: 'layout',
    layout: 'default',
    path: 'views'
  });

  server.route(routes);
});

module.exports = server;
