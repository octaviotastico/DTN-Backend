// Library Imports
const io = require("socket.io-client")

// Local Imports
const { checkUndefined, serializeMessage } = require('../commons/functions');
const { AAPMessageTypes } = require('../commons/constants');


// Sends a bundle via uD3TN's AAP interface
const sendBundle = ({ dest_eid = "http://localhost:7575", message = "Hello :D" }) => {
  checkUndefined(dest_eid, 'dest_eid');
  checkUndefined(message, 'message');
  const socket = io.connect(dest_eid);

  // Step 1: Register client
  socket.send(serializeMessage({
    messageType: AAPMessageTypes.REGISTER,
  }));

  // Step 2: Send message
  socket.send(serializeMessage({
    messageType: AAPMessageTypes.SENDBUNDLE,
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


module.exports = {
  sendBundle,
  sendMessage,
};
