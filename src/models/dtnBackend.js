const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Backend addresses model schema
const BackendAddresses = new Schema({
  host: { type: String, required: true },
  port: { type: String, required: true },
});

// Extra options for mongoose
BackendAddresses.options.toJSON = {
  transform: function (doc, ret) {
    ret.id = ret._id // Change _id key to id
    delete ret._id   // Don't include the _id in JSON
    delete ret.__v   // Don't include the __v in JSON
    return ret
  },
};

module.exports = mongoose.model('backend_addresses', BackendAddresses);
