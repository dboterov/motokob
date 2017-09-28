'use strict'

var Cost = require('../models/cost');
var mongoose = require('mongoose');

function list(req, res) {
  Cost.find({
    companyName: req.user.companyName
  }, (err, result) => {
    if (err) {
      res.status(500).send({
        message: 'Ocurrió un error al listar los costos'
      });
    } else {
      res.status(200).send(result);
    }
  }).sort({
    'companyName': 1,
    'name': 1
  });
}

function listCompanyCostNames(req, res) {
  Cost.find({
    companyName: req.user.companyName
  }).distinct("name", (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send({
        message: 'Ocurrió un error al listar los nombres de costo por empresa'
      });
    } else {
      res.status(200).send(result);
    }
  });
}

function listFilteredCostOptions(req, res) {
  console.log('filtrando opciones por empresa y nombre, ', req.params.name);
  Cost.find({
    companyName: req.user.companyName,
    name: req.params.name
  }, (err, result) => {
    if (err) {
      res.status(500).send({
        message: 'Ocurrió un error al listar los costos'
      });
    } else {
      res.status(200).send(result);
    }
  }).sort({
    'state.name': 1
  });
}

function save(req, res) {
  var cost = new Cost();
  var params = req.body;

  cost.name = params.name;
  cost.companyName = req.user.companyName;
  cost.value = params.value;
  cost.state = params.state;

  if (params._id && params._id.length > 0) {
    //cost._id = mongoose.Schema.Types.ObjectId(params._id);
    cost._id = params._id;
    console.log('actualizando', cost);
    Cost.findByIdAndUpdate(params._id, cost, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send({
          message: 'Ocurrió un error al actualizar la información de costos'
        });
      } else if (!result) {
        console.error('no result');
        res.status(404).send({
          message: 'No se recibió la información actualizada del costo'
        });
      } else {
        res.status(200).send(result);
      }
    });
  } else {
    cost.save((err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send({
          message: 'Ocurrió un error al guardar los costos. ' + err.message
        });
      } else {
        if (!result) {
          res.status(404).send({
            message: 'No se almacenó el costo'
          });
        } else {
          res.status(200).send(result);
        }
      }
    });
  }
}

module.exports = {
  list,
  listCompanyCostNames,
  listFilteredCostOptions,
  save
};
