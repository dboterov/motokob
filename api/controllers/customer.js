'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');
var Customer = require('../models/customer');
var jwt = require('../services/jwt');

function findByDocumentNumber(req, res) {
  console.log('buscando cliente');

  var find = Customer.findOne({
    documentNumber: req.params.documentNumber
  }, (err, customer) => {
    if (err) {
      res.status(500).send({
        message: 'ocurrio un error al consultar la informacion del cliente'
      });
    } else if (!customer) {
      res.status(404).send({
        message: 'no se encontró ningún cliente'
      });
    } else {
      res.status(200).send({
        customer: customer
      });
    }
  });
}

function list(req, res) {
  console.log('listando clientes registrados');
  var page = parseInt(req.query.page ? req.query.page : 1);
  var pageSize = parseInt(req.query.pageSize ? req.query.pageSize : 10);
  Customer.find({}).count({}, function(err, count) {
    Customer.find({}).sort('name').sort('surname').paginate(page, pageSize).populate({
      path: 'customer'
    }).exec(function(err, customers) {
      if (err) {
        res.status(500).send({
          message: 'error al listar clientes'
        });
      } else if (!customers) {
        res.status(404).send({
          message: 'no se encontraron clientes'
        });
      } else {
        return res.status(200).send({
          records: count,
          customers: customers
        });
      }
    });
  });
}

function saveCustomer(req, res) {
  console.log(req);
  var customer = new Customer();
  var params = req.body;

  customer.name = params.name;
  customer.surname = params.surname;
  customer.documentType = params.documentType;
  customer.documentNumber = params.documentNumber;
  customer.stateCode = params.stateCode;
  customer.cityCode = params.cityCode;
  customer.address = params.address;
  customer.landLineNumber = params.landLineNumber;
  customer.cellphoneNumber = params.cellphoneNumber;
  customer.email = params.email;

  //TODO: validar campos obligatorios
  customer.save((err, customerStored) => {
    if (err) {
      console.error(err.message);
      res.status(500).send({
        message: 'error al guardar el cliente. ' + err.message
      });
    } else if (!customerStored) {
      res.status(404).send({
        message: 'no se registro el cliente'
      });
    } else {
      res.status(200).send({
        customer: customerStored
      });
    }
  });
}

function updateCustomer(req, res) {
  var customerId = req.params.id;
  var update = req.body;

  Customer.findByIdAndUpdate(customerId, update, (err, customerUpdated) => {
    if (err) {
      res.status(500).send({
        message: 'ocurrio un error al actualizar la informacion del cliente'
      });
    } else if (!customerUpdated) {
      res.status(404).send({
        message: 'no se recibio la informacion actualizada del cliente'
      });
    } else {
      res.status(200).send({
        customer: customerUpdated
      });
    }
  });
}

module.exports = {
  saveCustomer,
  updateCustomer,
  list,
  findByDocumentNumber
};
