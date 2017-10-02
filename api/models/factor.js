'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FactorSchema = Schema({
  id: String,
  period: Number,
  factor: Number
});

module.exports = mongoose.model('Factor', FactorSchema);
