'use strict'

var express = require('express');
var RegionController = require('../controllers/region');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.get('/listStates', RegionController.listStates);
api.get('/listCities/:stateId', RegionController.listCities);

module.exports = api;
