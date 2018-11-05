const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: String,
  url: String,
  domain: String
});

module.exports = mongoose.model('Institution', schema);
