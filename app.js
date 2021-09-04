// Library Imports
const cors = require('cors');
const http = require('http');
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { Server } = require("socket.io");
const net = require('net');


// Local Imports
const commons = require('./src/commons/functions');
const { serializeMessage } = require('./src/commons/messages');
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

/* COMMENTED TEMPORARILY


// App setup
const app = express();
app.use(express.urlencoded({ extended: true }));``
app.use(express.json());
app.use(cors());


// Listen for HTTP requests on port 7474
app.listen(HTTP_PORT, () => {
  console.log('DTN Backend up and runnig!! 🛰️ 🛰️ 🛰️');
});


// Socket io server setup
const server = http.createServer(app);
const io = new Server(server);

// Socket server listening for CMS connections
io.on("connection", (socket) => {
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


*/



// Step 0: Setup - Create the netServer and the netClient

console.log(`[DEBUG] Server will listen to: ${DTNetwork_HOST}:${DTNetwork_PORT}`);
console.log(`[DEBUG] Server will register with: ${AGENT_ID}`);

const netServer = net.createServer((c) => {
  console.log('[netServer] Client connected');

  c.on('message', (msg) => {
    console.log('[netServer] Received `message`, MSG:', msg.toString());
  });

  c.on('*', (event, msg) => {
    console.log('[netServer] Received `*`, EVENT:', event);
    console.log('[netServer] Received `*`, MSG:', msg);
  });

}).listen({
  host: DTNetwork_HOST, // 'localhost',
  port: DTNetwork_PORT, // 4243,
  family: 4, // ipv4, socket.AF_INET
});

netServer.on('error', function (e) {
  if (e.code == 'EADDRINUSE') {
    console.log('Address in use, retrying...');
    setTimeout(function () {
      netServer.close();
      netServer.listen(DTNetwork_PORT, DTNetwork_HOST);
    }, 1);
  }
});

const netClient = net.createConnection(DTNetwork_PORT, DTNetwork_HOST, () => {
  console.log('[netClient] Connected');
});

// Step 1: Register to instance B of DTN with agent ID 'bundlesink'

netClient.write(serializeMessage({
  messageType: AAPMessageTypes.REGISTER,
  eid: AGENT_ID,
}));
