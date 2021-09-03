// Library Imports
const io = require("socket.io-client")

// Local Imports
const { checkUndefined } = require('../commons/functions');
const { serializeMessage } = require('../commons/messages');
const { AAPMessageTypes } = require('../commons/constants');

// Register only, if you don't want to send anyting and just listen for new messages.
const registerMessage = ({ dest_eid }) => {
  checkUndefined(dest_eid, 'dest_eid');
  const socket = io.connect(dest_eid);

  socket.send(serializeMessage({
    messageType: AAPMessageTypes.REGISTER,
  }));
};


// Sends a bundle via uD3TN's AAP interface
const sendBundle = ({ dest_eid, message }) => {
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

// Sends a message over the connection
const sendCMSMessage = ({ dest, message, messageType = null }) => {
  checkUndefined(dest, 'dest');
  checkUndefined(message, 'message');

  const socket = io.connect(dest);
  if (messageType === null) {
    socket.send(message);
  } else {
    socket.emit(messageType, message);
  }
};


module.exports = {
  registerMessage,
  sendBundle,
  sendMessage,
  sendCMSMessage,
};
