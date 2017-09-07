'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');
var Customer = require('../models/customer');
var jwt = require('../services/jwt');

function findByDocumentNumber(req, res) {
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
  var page = parseInt(req.query.page ? req.query.page : 1);
  var pageSize = parseInt(req.query.pageSize ? req.query.pageSize : 10);
  var strFilter = req.query.strFilter;
  var queryObject = {};
  if (strFilter) {
    queryObject = {
      $or: [{
        "name": new RegExp(strFilter, "i")
      }, {
        "surname": new RegExp(strFilter, "i")
      }, {
        "email": new RegExp(strFilter, "i")
      }, {
        "cellphoneNumber": new RegExp(strFilter, "i")
      }, {
        "landLineNumber": new RegExp(strFilter, "i")
      }, {
        "documentNumber": new RegExp(strFilter, "i")
      }]
    };
  }
  Customer.find(queryObject).count({}, function(err, count) {
    Customer.find(queryObject).sort('name').sort('surname').paginate(page, pageSize).populate({
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
  customer.companyName = params.companyName;
  customer.image = params.image;

  console.log('guardando nuevo cliente: ' + JSON.stringify(customer));

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

function uploadImage(req, res) {
  var customerId = req.params.id;
  if (req.files && req.files.length > 0) {
    console.log('-------------------------------------');
    console.log(req.files);
    console.log('-------------------------------------');

    var filePath = req.files.image.path;
    var fileSplit = filePath.split('\\');
    var fileName = fileSplit[2];
    var extSplit = fileName.split('\.');
    var fileExt = extSplit[1];
    console.log('fileName: ' + fileName);

    if (customerId) {
      Customer.findByIdAndUpdate(customerId, {
        images: fileName
      }, (err, result) => {
        if (err) {
          res.status(500).send({
            message: 'Ocurrió un error al recibir la foto del cliente'
          });
        } else if (!result) {
          res.status(404).send({
            message: 'No se ha podido actualizar la foto del cliente'
          });
        } else {
          res.status(200).send(fileName);
        }
      });
    } else {
      res.status(200).send(fileName);
    }
  } else {
    res.status(200).send({
      message: 'no subiste ninguna imagen'
    });
  }
}

function getImageFile(req, res) {
  var imageFile = req.params.imageFile;
  var path_file = './uploads/customers/' + imageFile;

  fs.exists(path_file, function(exists) {
    if (exists) {
      res.sendFile(path.resolve(path_file));
    } else {
      res.status(200).send({
        message: 'No se encontro la imagen...'
      });
    }
  });
}

module.exports = {
  saveCustomer,
  updateCustomer,
  list,
  findByDocumentNumber,
  uploadImage,
  getImageFile
};
