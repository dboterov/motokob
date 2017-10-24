'use strict'

var mongoose = require('mongoose');
var Brand = require('./brand');
var ProductType = require('./productType');
var Schema = mongoose.Schema;

var ProductSchema = Schema({
  name: String,
  brand: Brand,
  model: Number,
  cylinder: String,
  price: Number,
  productType: ProductType,
  colors: Array,
  images: Array,
  active: Boolean
});

module.exports = mongoose.model('Product', ProductSchema);
