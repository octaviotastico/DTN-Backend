const sleep = (seconds) => {
  return new Promise(resolve => setTimeout(resolve, seconds));
};

const checkUndefined = (obj, name) => {
  if (typeof obj === 'undefined') {
    throw new Error(`${name} must not be left undefined`);
  }
};

const isValidDate = (d) => {
  return d instanceof Date && !isNaN(d);
};

const checkRequiredFields = (obj, requiredFields) => {
  requiredFields.forEach((field) => {
    checkUndefined(obj[field], field);
  });
};

const checkEmptyFields = (obj, emptyFields) => {
  emptyFields.forEach((field) => {
    if (typeof obj[field] !== 'undefined') {
      if (obj[field] === null || obj[field] === '') {
        throw new Error(`${field} must not be left empty`);
      }
    }
  });
};

const checkFieldTypes = (obj, fieldTypes) => {
  Object.keys(fieldTypes).forEach((field) => {
    if (typeof obj[field] !== 'undefined') {
      if (typeof obj[field] !== fieldTypes[field]) {
        throw new Error(`${field} must be of type ${fieldTypes[field]}`);
      }
    }
  });
};

const getNonUndefinedFields = (obj, fields) => {
  const nonUndefinedFields = {};
  fields.forEach((field) => {
    if (typeof obj[field] !== 'undefined') {
      nonUndefinedFields[field] = obj[field];
    }
  });
  return nonUndefinedFields;
};

const getDefinedValues = (obj) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] !== 'undefined') {
      newObj[key] = obj[key];
    }
  });

  console.log("pingo", obj);

  console.log("pingocho", newObj);
  return newObj;
}

module.exports = {
  sleep,
  checkUndefined,
  isValidDate,
  checkRequiredFields,
  checkEmptyFields,
  checkFieldTypes,
  getNonUndefinedFields,
  getDefinedValues,
};
