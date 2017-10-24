'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductSchema = Schema({
  name: String,
  brand: {type: mongoose.Schema.Types.ObjectId, ref: 'Brand'},
  model: Number,
  cylinder: String,
  price: Number,
  productType: {type: mongoose.Schema.Types.ObjectId, ref: 'ProductType'},
  colors: Array,
  images: Array,
  active: Boolean
});

module.exports = mongoose.model('Product', ProductSchema);
