'use strict'

var express = require('express');
var ProductController = require('../controllers/product');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/products'});

api.get('/list', md_auth.ensureAuth, ProductController.productsList);
api.post('/save', md_auth.ensureAuth, ProductController.saveProduct);
api.put('/update/:id', md_auth.ensureAuth, ProductController.updateProduct);
api.put('/upload', [md_upload], ProductController.uploadImage);
api.get('/get-image/:imageFile', ProductController.getImageFile);

module.exports = api;
