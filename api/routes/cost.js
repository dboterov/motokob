'use strict'

var express = require('express');
var CostController = require('../controllers/cost');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.get('/', md_auth.ensureAuth, CostController.list);
api.get('/names', md_auth.ensureAuth, CostController.listCompanyCostNames);
api.get('/:name', md_auth.ensureAuth, CostController.listFilteredCostOptions);
api.post('/', md_auth.ensureAuth, CostController.save);

module.exports = api;
