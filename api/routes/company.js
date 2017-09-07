'use strict'

var express = require('express');
var CompanyController = require('../controllers/company');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');

api.get('/', md_auth.ensureAuth, CompanyController.list);
api.post('/', md_auth.ensureAuth, CompanyController.save);

module.exports = api;
