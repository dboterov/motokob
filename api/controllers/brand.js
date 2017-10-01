'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');
var Brand = require('../models/brand');
var jwt = require('../services/jwt');

function list(req, res) {
  Brand.find().sort('name').exec((err, brands) => {
    if(err){
      res.status(500).send({
        message: 'error al listar las marcass'
      });
    } else {
      if(!brands){
        res.status(404).send({
          message: 'no se encontraron marcas'
        });
      } else {
        return res.status(200).send(brands);
      }
    }
  });
}

function findById(req, res) {
  var find = Brand.findOne({
    _id: req.params.id
  }, (err, brand) => {
    if (err) {
      res.status(500).send({
        message: 'ocurrio un error al consultar la informacion de la marca'
      });
    } else if (!brand) {
      res.status(404).send({
        message: 'no se encontró ninguna marca'
      });
    } else {
      res.status(200).send({
        brand: brand
      });
    }
  });
}

function save(req, res) {
  var brand = new Brand();
  var params = req.body;

  brand.name = params.name.toUpperCase();

  brand.save((err, brandStored) => {
    if(err){
      res.status(500).send({
        message: 'error al guardar la marca. ' + err.message
      });
    } else {
      if(!brandStored){
        res.status(404).send({
          message: 'no se registro la marca'
        });
      } else {
        res.status(200).send({
          brand: brandStored
        });
      }
    }
  });
}

module.exports = {
  list,
  findById,
  save
};
