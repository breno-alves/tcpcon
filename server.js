const net = require('net');

const PORT = 1337;
const HOST = '127.0.0.1';

const server = net.createServer();

server.listen(PORT, HOST, function () {
  console.log(`TCP Server running on ${HOST}:${PORT}`);
});

let sockets = [];

server.on('connection', function (socket) {
  console.log(`${socket.remoteAddress}:${socket.remotePort} connect.`);
  sockets.push(socket);

  socket.on('data', function (data) {
    data = data.toString('utf-8').split(' ');

    if (data[0] == 'pm') {
      const destination = data[1].split(':');
      let msg = '';

      data.map((word, index) => {
        if (index != 0 && index != 1) msg += ` ${word}`;
      });

      sockets.map((client) => {
        if (client.remoteAddress == destination[0] && client.remotePort == destination[1]) {
          client.write(`PM From: ${socket.remoteAddress}:${socket.remotePort}\nMessage: ${msg}\n`);
        }
      });

    } else {

      sockets.map((client) => {
        if (client.remoteAddress != socket.remoteAddress || client.remotePort != socket.remotePort) {
          client.write(`${socket.remoteAddress}:${socket.remotePort} said: ${data}\n`);
        }
      });
    }
  });

  socket.on('close', function (data) {
    const index = sockets.findIndex(function (o) {
      return o.remoteAddress === socket.remoteAddress && o.remotePort === socket.remotePort;
    });

    if (index !== -1) {
      sockets.splice(index, 1);
    }

    console.log('Conecttion closed by ' + socket.remoteAddress + ':' + socket.remotePort);
  });
});
