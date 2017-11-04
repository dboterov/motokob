'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CompanySchema = Schema({
  nit: String,
  name: String,
  stores: String,
  active: Boolean
});

module.exports = mongoose.model('Company', CompanySchema);
