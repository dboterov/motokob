'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StateSchema = Schema({
  _id: mongoose.Schema.Types.ObjectId,
  code: String,
  name: String
});

module.exports = mongoose.model('State', StateSchema);
