const handleRequest = async (req, res, methodController, next) => {
  let response = null;
  try {
    // TODO: Use logger instead of console.log
    console.log(`handleRequest - controllerMethodName[${methodController.name}]`);
    response = await methodController(req, res, next);
  } catch (ex) {
    // TODO: Use logger instead of console.log
    console.error(`handleRequest - errorMessage[${ex.message}] - errorStackTrace[${ex.stack}]`);
  } finally {
    return response;
  }
};

module.exports = {
  handleRequest
};
