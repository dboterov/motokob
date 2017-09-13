'use strict'

var fs = require('fs');
var path = require('path');
var Color = require('../models/color');
var jwt = require('../services/jwt');

function list(req, res) {
  console.log('listando marcas registrados');

  Color.find().sort('name').exec((err, colors) => {
    if (err) {
      res.status(500).send({
        message: 'error al listar los colores'
      });
    } else {
      if (!colors) {
        res.status(404).send({
          message: 'no se encontraron colores'
        });
      } else {
        return res.status(200).send({
          colors: colors
        });
      }
    }
  });
}

function save(req, res) {
  var color = new Color();
  var params = req.body;

  color.name = params.name.substring(0, 1).toUpperCase() + params.name.substring(1).toLowerCase();

  color.save((err, colorStored) => {
    if (err) {
      res.status(500).send({
        message: 'error al guardar el color. ' + err.message
      });
    } else {
      if (!colorStored) {
        res.status(404).send({
          message: 'no se registro el color'
        });
      } else {
        res.status(200).send({
          color: colorStored
        });
      }
    }
  });
}

module.exports = {
  list,
  save
};
