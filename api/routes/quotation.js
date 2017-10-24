'use strict'

var express = require('express');
var QuotationController = require('../controllers/quotation');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.get('/', md_auth.ensureAuth, QuotationController.list);
api.get('/pdf/:quotationNumber', QuotationController.generatePDF);
api.post('/', md_auth.ensureAuth, QuotationController.save);
api.put('/:id', md_auth.ensureAuth, QuotationController.save);
api.put('/create/:id', md_auth.ensureAuth, QuotationController.createDocument);
api.delete('/:id', md_auth.ensureAuth, QuotationController.remove);

module.exports = api;
