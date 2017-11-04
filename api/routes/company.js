'use strict'

var express = require('express');
var CompanyController = require('../controllers/company');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/companies'});

api.get('/', md_auth.ensureAuth, CompanyController.list);
api.get('/:id', md_auth.ensureAuth, CompanyController.find);
api.post('/', md_auth.ensureAuth, CompanyController.save);
api.put('/', md_auth.ensureAuth, CompanyController.update);
api.put('/upload', [md_upload], CompanyController.uploadImage);
api.get('/get-image/:imageFile', CompanyController.getImageFile);

module.exports = api;
