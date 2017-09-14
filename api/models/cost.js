'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CostSchema = Schema({
  //_id: mongoose.Schema.Types.ObjectId,
  name: String,
  value: Number,
  companyName: String,
  state: {
    code: String,
    name: String
  }
});

module.exports = mongoose.model('Cost', CostSchema);
