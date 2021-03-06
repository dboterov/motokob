'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CustomerSchema = Schema({
  name: String,
  surname: String,
  companyName: String,
  documentType: String,
  documentNumber: String,
  stateCode: String,
  cityCode: String,
  address: String,
  landLineNumber: String,
  cellphoneNumber: String,
  email: String,
  image: String
});

module.exports = mongoose.model('Customer', CustomerSchema);
