'use strict'

var fs = require('fs');
var path = require('path');
var ProductType = require('../models/productType');
var jwt = require('../services/jwt');

function list(req, res) {
  console.log('listando tipo de productos registrados');

  ProductType.find().sort('name').exec((err, productTypes) => {
    if(err){
      res.status(500).send({
        message: 'error al listar los tipos de productos'
      });
    } else {
      if(!productTypes){
        res.status(404).send({
          message: 'no se encontraron tipos de productos'
        });
      } else {
        return res.status(200).send({
          productTypes: productTypes
        });
      }
    }
  });
}


function save(req, res) {
  console.log(req);
  var productType = new ProductType();
  var params = req.body;

  productType.name = params.name;

  productType.save((err, productTypeStored) => {
    if (err) {
      res.status(500).send({
        message: 'error al guardar el tipo de producto. ' + err.message
      });
    } else {
      if (!productTypeStored) {
        res.status(404).send({
          message: 'no se registro el tipo de producto'
        });
      } else {
        res.status(200).send({
          productType: productTypeStored
        });
      }
    }
  });
}

module.exports = {
  list,
  save
};
