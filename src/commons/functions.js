const sleep = (seconds) => {
  return new Promise(resolve => setTimeout(resolve, seconds));
};


const checkUndefined = (obj, name) => {
  if (typeof obj === 'undefined') {
    throw new Error(`${name} must not be left undefined`);
  }
};

const parseParameters = (args, argName, envName, defaultValue) => {
  if (args.includes(argName))
    return args[args.indexOf(argName) + 1];
  if (process.env[envName])
    return process.env[envName];
  return defaultValue;
}

module.exports = {
  sleep,
  checkUndefined,
  parseParameters,
};
