'use strict'

var express = require('express');
var DocumentController = require('../controllers/documents');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.post('/quotation/', /*md_auth.ensureAuth,*/ DocumentController.createQuotation);

module.exports = api;
