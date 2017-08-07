'use strict'

var express = require('express');
var ProductTypeController = require('../controllers/productType');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/customers'});

api.post('/save', md_auth.ensureAuth, ProductTypeController.save);
api.get('/list', md_auth.ensureAuth, ProductTypeController.list);

module.exports = api;
