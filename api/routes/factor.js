'use strict'

var express = require('express');
var FactorController = require('../controllers/factor');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.get('/', md_auth.ensureAuth, FactorController.list);

module.exports = api;
