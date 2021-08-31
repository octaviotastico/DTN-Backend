// Library Imports
const express = require('express');

// Local Imports
const aapController = require('../controllers/aap');
const routeController = require('../commons/routeController');

// Routing
const router = express.Router();


// Send a new bundle via uD3TN's AAP interface.
router.post('/', (req, res) => {
  routeController.handleRequest(req, res, aapController.aapSend);
});

// Waits for a new bundle to be received via uD3TN's AAP interface.
router.get('/', (req, res) => {
  routeController.handleRequest(req, res, aapController.aapReceive);
});

module.exports = router;
