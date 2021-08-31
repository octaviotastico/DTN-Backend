// Library Imports
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Local Imports
const socketAAP = require('./src/socket/aap_server');
const socketCMS = require('./src/socket/cms_server');

// App creation
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors())

// Database Connection
mongoose.connect('mongodb://localhost:27017/dtn-backend-db', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then(() => {
  console.log('Connected to database');
});

// HTTP Calls for CMS Backend
app.use('/aap', require('./src/routes/aap'));

// Socket connection for CMS Backend
const socketServerCMS = null;

// Socket connection for DTN Node
const socketServerAAP = socketAAP.createServer();
socketServerAAP.listen(3001, "localhost");


// App listening to port 2424
app.listen(2424, () => {
  console.log('DTN Backend up and runnig!! 🛰️🛰️🛰️');
});
