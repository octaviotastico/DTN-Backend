// Library Imports
const cors = require('cors');
const http = require('http');
const express = require('express');
const { Server } = require("socket.io");


// App setup
const app = express();
app.use(express.urlencoded({ extended: true }));``
app.use(express.json());
app.use(cors());


// Listen for HTTP requests on port 7474
app.listen(7474, () => {
  console.log('DTN Backend up and runnig!! 🛰️ 🛰️ 🛰️');
});


// Socket io server setup
const server = http.createServer(app);
const io = new Server(server);


// (Move to a separate file)
io.on("connection", (socket) => {
  console.log("Socket connection made!");

  // Wellcome message
  socket.emit("message", "Hello from the DTN backend!");

  // Listen for new DTN messages, to update local CMS Backends
  socket.on("message", (data) => {
    console.log("Received DTN message:", data);
    console.log("Forwarding DTN message to CMS Backend...");
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
server.listen(7575, () => {
  console.log('Socket connection for DTN Backend up and runnig!! 🛰️ 🛰️ 🛰️');
});
