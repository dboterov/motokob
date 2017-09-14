'use strict'

var express = require('express');
var ColorController = require('../controllers/color');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');

api.get('/list', md_auth.ensureAuth, ColorController.list);
api.get('/find/:name', md_auth.ensureAuth, ColorController.find);
api.post('/save', md_auth.ensureAuth, ColorController.save);

module.exports = api;
