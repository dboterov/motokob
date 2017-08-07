'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductTypeSchema = Schema({
  name: String
});

module.exports = mongoose.model('ProductType', ProductTypeSchema);
