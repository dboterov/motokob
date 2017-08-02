'user strict'

var express = require('express');
var PruebaController = require('../controllers/prueba');

var api = express.Router();

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/images'});

api.post('/upload', [md_upload], PruebaController.uploadImage);
api.get('/getimage/:imageFile', PruebaController.getImageFile);

module.exports = api;
