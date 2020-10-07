const net = require('net');
const client = new net.Socket();
const PORT = 1337;
const HOST = '127.0.0.1';

const std_input = process.stdin;
std_input.setEncoding('utf-8');

client.connect(PORT, HOST, function () {
  console.log('Connected...');
});

client.on('data', function (data) {
  console.log(data.toString('utf-8'));
});

std_input.on('data', function (data) {
  if (data === 'exit\n') process.exit();

  client.write(data);
});
