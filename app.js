const redis = require('redis');
const client = redis.createClient();

client.on('connect', function() {
    console.log('connected');
});

client.set('testKEY', 'testVALUE', function(err, reply) {
  console.log(reply);
});

client.get('testKEY', function(err, reply) {
    console.log(reply);
});

client.exists('testKEY', function(err, reply) {
    if (reply === 1) {
        console.log('exists');
    } else {
        console.log('doesn\'t exist');
    }
});
