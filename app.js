// Library Imports
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const socket_io = require("socket.io");
const client_io = require("socket.io-client");
const net = require('net');

// Local Imports
const commons = require('./src/commons/functions');
const { serializeMessage, deserializeMessage } = require('./src/services/messages');
const { AAPMessageTypes } = require('./src/commons/constants');

// Parsing parameters (if given)
var args = process.argv.slice(2);

// DTN Backend (our) Variables
const TCP_PORT = commons.parseParameters(args, '--tcp-port', 'TCP_PORT', 7575);
const AGENT_ID = commons.parseParameters(args, '--agent-id', 'AGENT_ID', 'bundlesink'); // uuidv4());

// CMS Backend (their) Variables
const CMS_HOST = commons.parseParameters(args, '--cms-host', 'CMS_HOST', 'localhost');
const CMS_PORT = commons.parseParameters(args, '--cms-port', 'CMS_PORT', 2525);

// DTN (network) Variables
// This should be inside a list, not a single value passed as parameter
const DTNetwork_HOST = commons.parseParameters(args, '--dtn-host', 'DTN_HOST', 'localhost');
const DTNetwork_PORT = commons.parseParameters(args, '--dtn-port', 'DTN_PORT', 4243);


// Saving them so we can use them later
global.TCP_PORT = TCP_PORT;
global.AGENT_ID = AGENT_ID;
global.CMS_HOST = CMS_HOST;
global.CMS_PORT = CMS_PORT;
global.DTNetwork_HOST = DTNetwork_HOST;
global.DTNetwork_PORT = DTNetwork_PORT;


////////////////////////////////
///// Local Database setup /////
////////////////////////////////


// Database Connection
mongoose.connect('mongodb://localhost:27017/cms-db', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then(() => {
  console.log('Connected to database');
});


//////////////////////////////////////////////////////////////////
///// Socket server for listening to CMS Backend connections /////
//////////////////////////////////////////////////////////////////


const socketServer = socket_io(TCP_PORT);

// Socket server listening for CMS connections
socketServer.on("connection", (socket) => {
  console.log("Socket connection made!");

  // Wellcome message
  socket.emit("message", "Hello from the DTN backend!");

  // Listen for new local CMS Backend messages, to forward them to the DTN
  socket.on("local-cms", (data) => {
    console.log("Received local CMS message:", data);
    console.log("Forwarding CMS message to DTN...");

    const localDTNNode = client_io.connect(`http://${DTNetwork_HOST}:${DTNetwork_PORT}`);

    localDTNNode.send(serializeMessage({
      messageType: AAPMessageTypes.REGISTER,
      eid: uuidv4(),
    }));

    localDTNNode.send(serializeMessage({
      eid: 'dtn://b.dtn/bundlesink',
      messageType: AAPMessageTypes.SENDBUNDLE,
      payload: JSON.stringify(data)
    }));
  });

  socket.on("message", (data) => {
    console.log("Received message from local CMS!", data);
  });

  // Catch any socket connection errors
  socket.on("error", (error) => {
    console.log("Socket error:", error);
  });

  // Goodbye message
  socket.on("disconnect", () => {
    console.log("Socket disconnected!");
  });
});


////////////////////////////////////////////////////////////////////
///// Socket client connection to send messages to CMS Backend /////
////////////////////////////////////////////////////////////////////


// Step 0: Setup - Create the netClient and cmsClient
const netClient = net.createConnection(DTNetwork_PORT, DTNetwork_HOST);
const cmsClient = client_io.connect(`http://${CMS_HOST}:${CMS_PORT}`);

// Step 1: Register to instance B of DTN with agent ID 'bundlesink'
netClient.write(serializeMessage({
  messageType: AAPMessageTypes.REGISTER,
  eid: AGENT_ID,
}));

// Step 2: Listen for DTN messages from instance A
netClient.on('data', (data) => {
  console.log('[netClient on data] Received data:');

  const deserializedMessage = deserializeMessage(data);
  if (deserializedMessage.error) return; // TODO: Handle this better
  const deserializedPayload = deserializedMessage?.payload?.toString('utf8') || "";
  console.log('Deserialized message:', deserializedMessage);
  console.log('Deserialized payload:', deserializedPayload);

  // Step 3: Forward DTN messages to CMS Backend
  cmsClient.emit("text-message", {
    ...deserializedMessage,
    payload: deserializedPayload,
  });
});

netClient.on("error", (err) => {
  console.log("[netClient on error]", err);
});
