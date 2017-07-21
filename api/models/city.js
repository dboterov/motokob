'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CitySchema = Schema({
  code: String,
  name: String,
  state: {type: mongoose.Schema.Types.ObjectId, ref: 'State'}
});

module.exports = mongoose.model('City', CitySchema);
