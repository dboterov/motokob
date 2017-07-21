'use strict'

var express = require('express');
var CustomerController = require('../controllers/customer');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/customers'});

api.get('/list', md_auth.ensureAuth, CustomerController.list);
api.post('/save', md_auth.ensureAuth, CustomerController.saveCustomer);
api.put('/update/:id', md_auth.ensureAuth, CustomerController.updateCustomer);
api.get('/find/:documentNumber', md_auth.ensureAuth, CustomerController.findByDocumentNumber);

module.exports = api;
