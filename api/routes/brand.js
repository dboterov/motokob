'use strict'

var express = require('express');
var BrandController = require('../controllers/brand');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/customers'});

api.get('/find/:id', md_auth.ensureAuth, BrandController.findById);
api.get('/list', md_auth.ensureAuth, BrandController.list);
api.post('/save', md_auth.ensureAuth, BrandController.save);

module.exports = api;
