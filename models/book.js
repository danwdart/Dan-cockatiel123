const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  isbn: String,
  title: String,
  author: String, // this could be a relationship to an authors collection
  institutions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Institution' }]
});

module.exports = mongoose.model('Book', schema);
