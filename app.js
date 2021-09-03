// Library Imports
const cors = require('cors');
const http = require('http');
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { Server } = require("socket.io");


// Local Imports
const commons = require('./src/commons/functions');
const client = require('./src/socket/client');


// Parsing parameters (if given)
var args = process.argv.slice(2);
// DTN Backend (our) Variables
const HTTP_PORT = commons.parseParameters(args, '--http-port', 'HTTP_PORT', 7474);
const TCP_PORT = commons.parseParameters(args, '--tcp-port', 'TCP_PORT', 4243); // 7575
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



// Delete plssss
const testttt__DTN_to_DTNBackend_to_CMSBackend = (data) => {
  client.sendCMSMessage({
    dest_eid: `${CMS_HOST}:${CMS_PORT}`,
    message: data,
    messageType: 'update',
  });
}

// Delete plssss
const testttt__Register_and_wait_for_DTN_packet = () => {
  client.registerMessage({
    dest_eid: `${DTNetwork_HOST}:${DTNetwork_PORT}`,
  })
}



// (Move to a separate file)
io.on("connection", (socket) => {
  console.log("Socket connection made!");

  // Wellcome message
  socket.emit("message", "Hello from the DTN backend!");

  // Listen for new DTN messages, to update local CMS Backends
  socket.on("message", (data) => {
    console.log("Received DTN message:", data);
    console.log("Forwarding DTN message to CMS Backend...");
    testttt__DTN_to_DTNBackend_to_CMSBackend(data);
  });

  // Listen for new CMS Backend messages, to update non-local CMS Backends
  socket.on("cms-message", (data) => {
    console.log("Received CMS Backend message:", data);
    console.log("Forwarding CMS message to DTN...");
  });

  // Goodbye message
  socket.on("disconnect", () => {
    console.log("Socket disconnected!");
  });
});


// Listen for socket requests on port 7575
server.listen(TCP_PORT, () => {
  console.log('Socket connection for DTN Backend up and runnig!! 🛰️ 🛰️ 🛰️');
  testttt__Register_and_wait_for_DTN_packet();
});
