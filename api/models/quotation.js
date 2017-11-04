'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuotationSchema = Schema({
  company: {},
  customer: {},
  quotationNumber: Number,
  date: Date,
  status: String,
  seller: {},
  items: Array
});

module.exports = mongoose.model('Quotation', QuotationSchema);
