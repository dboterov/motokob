'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ColorSchema = Schema({
  name: String
});

module.exports = mongoose.model('Color', ColorSchema);
