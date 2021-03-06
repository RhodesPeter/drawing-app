const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const conn = mongoose.connection;

require('env2')(`${__dirname}/../../.env`);
const user = process.env.DB_USER;
const pass = process.env.DB_PASS;
const database = process.env.DB_DATABASE;

const uri = `mongodb://${user}:${pass}@ds143201.mlab.com:43201/${database}`;

const options = {
  server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }
};

mongoose.connect(uri, options);

conn.on('error', console.error.bind(console, 'connection error:'));
conn.once('open', () => {
  console.log('We are connected!');
});

const DrawingAppSchema = new Schema({
  drawing: String
});

const DrawingAppDB = mongoose.model('drawing-app-db', DrawingAppSchema);

module.exports = DrawingAppDB;
