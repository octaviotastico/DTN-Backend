// Library Imports
const net = require('net');

// Returns a new connection
const createConnection = (host='localhost', port=4242) => {
  return net.createConnection({ host, port });
};

// Returns a new server
const createServer = (port=4242) => {
  return net.createServer((socket) => {
    socket.on('data', (data) => {
      console.log(data.toString());
    });
  }).listen(port);
};

const listenServer = (server, host) => {
  server.listen(port, host);
};

module.exports = {
  createServer,
  listenServer
};