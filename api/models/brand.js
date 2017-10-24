'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BrandSchema = Schema({
  //id: String,
  name: String,
  logo: String
});

module.exports = mongoose.model('Brand', BrandSchema);
