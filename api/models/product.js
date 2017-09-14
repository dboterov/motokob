'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductSchema = Schema({
  name: String,
  brandId: String,
  model: Number,
  cylinder: String,
  price: Number,
  productTypeId: String,
  colors: Array,
  images: Array
});

module.exports = mongoose.model('Product', ProductSchema);
