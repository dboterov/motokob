'use strict'

var express = require('express');
var RestrictionsController = require('../controllers/restrictions');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.get('/installments/:company_id', md_auth.ensureAuth, RestrictionsController.getMaximumInstallments);
api.post('/', md_auth.ensureAuth, RestrictionsController.save);

module.exports = api;
