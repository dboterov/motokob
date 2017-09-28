'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RestrictionsSchema = Schema({
  company_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Company'},
  product_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
  max_installments: Number
});

module.exports = mongoose.model('Restrictions', RestrictionsSchema);
