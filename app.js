// Library Imports
const cors = require('cors');
const http = require('http');
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { Server } = require("socket.io");
const io = require("socket.io-client");
const net = require('net');

// Local Imports
const commons = require('./src/commons/functions');
const { serializeMessage, deserializeMessage } = require('./src/commons/messages');
const { AAPMessageTypes } = require('./src/commons/constants');

// Parsing parameters (if given)
var args = process.argv.slice(2);

// DTN Backend (our) Variables
const HTTP_PORT = commons.parseParameters(args, '--http-port', 'HTTP_PORT', 7474);
const TCP_PORT = commons.parseParameters(args, '--tcp-port', 'TCP_PORT', 7575);
const AGENT_ID = commons.parseParameters(args, '--agent-id', 'AGENT_ID', 'bundlesink'); // uuidv4());

// CMS Backend (their) Variables
const CMS_HOST = commons.parseParameters(args, '--cms-host', 'CMS_HOST', 'http://localhost');
const CMS_PORT = commons.parseParameters(args, '--cms-port', 'CMS_PORT', 2525);

// DTN (network) Variables
const DTNetwork_HOST = commons.parseParameters(args, '--dtn-host', 'DTN_HOST', 'localhost');
const DTNetwork_PORT = commons.parseParameters(args, '--dtn-port', 'DTN_PORT', 4243);


// Saving them so we can use them later
global.HTTP_PORT = HTTP_PORT;
global.TCP_PORT = TCP_PORT;
global.AGENT_ID = AGENT_ID;
global.CMS_HOST = CMS_HOST;
global.CMS_PORT = CMS_PORT;
global.DTNetwork_HOST = DTNetwork_HOST;
global.DTNetwork_PORT = DTNetwork_PORT;


/////////////////////////////
///// HTTP Server setup /////
/////////////////////////////


// App setup
const app = express();
app.use(express.urlencoded({ extended: true }));``
app.use(express.json());
app.use(cors());


// Listen for HTTP requests on port 7474
app.listen(HTTP_PORT, () => {
  console.log('DTN Backend up and runnig!! 🛰️ 🛰️ 🛰️');
});


////////////////////////////////
///// CMS connection setup /////
////////////////////////////////


// Socket io server setup
const server = http.createServer(app);
const client = new Server(server);

// Socket server listening for CMS connections
client.on("connection", (socket) => {
  console.log("Socket connection made!");

  // Wellcome message
  socket.emit("message", "Hello from the DTN backend!");

  // Listen for new DTN messages, to update local CMS Backends
  socket.on("message", (data) => {
    console.log("Received DTN message:", data);
    console.log("Forwarding DTN message to CMS Backend...");
  });

  // Goodbye message
  socket.on("disconnect", () => {
    console.log("Socket disconnected!");
  });
});


// Listen for CMS Backend socket requests on port 7575
server.listen(TCP_PORT, () => {
  console.log('Socket connection for DTN Backend up and runnig!! 🛰️ 🛰️ 🛰️');
});


////////////////////////////////
///// DTN connection setup /////
////////////////////////////////


// Step 0: Setup - Create the netClient
const netClient = net.createConnection(DTNetwork_PORT, DTNetwork_HOST, () => {
  console.log('[netClient] Connected');
});

const cmsClient = io.connect(`${CMS_HOST}:${CMS_PORT}`);

// Step 1: Register to instance B of DTN with agent ID 'bundlesink'
netClient.write(serializeMessage({
  messageType: AAPMessageTypes.REGISTER,
  eid: AGENT_ID,
}));

// Step 2: Listen for DTN messages from instance A
netClient.on('data', (data) => {
  console.log('[netClient on data] Received data:');

  const deserializedMessage = deserializeMessage(data);
  const deserializedPayload = deserializedMessage?.payload?.toString('utf8') || "";
  console.log('Deserialized message:', deserializedMessage);
  console.log('Deserialized payload:', deserializedPayload);

  // Step 3: Forward DTN messages to CMS Backend
  cmsClient.emit("text-message", deserializedMessage);
});
