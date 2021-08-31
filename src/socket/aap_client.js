// Library Imports
const net = require('net');

// Local Imports
const commons = {
  ...require('../commons/functions'),
  ...require('../commons/constants')
};

// Returns a new connection
const createConnection = (host='localhost', port=4242) => {
  return net.createConnection({ host, port });
};

// Sends a bundle via uD3TN's AAP interface
const sendBundle = ({ dest_eid, message }) => {
  const dest_err = commons.checkUndefined(dest_eid, 'dest_eid');
  const msg_err = commons.checkUndefined(message, 'message');
  if (dest_err || msg_err) {
    return dest_err || msg_err;
  }

  const client = createConnection();

  // Step 1: Register client
  client.write(commons.serializeMessage({
    messageType: commons.AAPMessageTypes.REGISTER
  }));

  // Step 2: Send message
  client.write(commons.serializeMessage({
    messageType: commons.AAPMessageTypes.SENDBUNDLE,
    payload: message,
    eid: dest_eid,
  }));
};

// Sends a bundle via uD3TN's AAP interface
const sendMessage = ({ dest_eid, message }) => {
  return sendBundle({
     dest_eid,
     message: Buffer.from(message, 'utf8')
  });
};

const receiveMessage = (waitTime) => {
  const client = createConnection();
  client.setTimeout(waitTime);

  client.on('timeout', () => {
    console.error(`Timed out after ${waitTime}ms`);
    client.end();
  });

  return new Promise (resolve => {client.on('data', (data) => {
    console.log(`Received message from server: ${data}`);
    resolve(data);
  })});
}



module.exports = {
  createConnection,
  sendBundle,
  sendMessage,
  receiveMessage,
};