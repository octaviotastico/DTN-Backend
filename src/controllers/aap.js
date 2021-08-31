const appDelegate = require('../delegates/aap');

const aapSend = async (req, res) => {
  const {
    dest_eid = "dtn://host2.dtn/bundlesink",
    message = "Hello, World!",
    waitTime = 0
  } = req.body;

  return await appDelegate.aapSend({ dest_eid, message, waitTime });
};

const aapReceive = (req, res) => {
  const { waitTime = 0 } = req.body;
  return appDelegate.aapReceive({ waitTime });
};

module.exports = {
  aapSend,
  aapReceive,
};