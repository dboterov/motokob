'use strict'

var Restrictions = require('../models/restrictions');
var mongoose = require('mongoose');

function save(req, res) {
  var restriction = new Restrictions();
  restriction.product_id = req.body.product_id;
  restriction.company_id = req.body.company_id;
  restriction.max_installments = req.body.max_installments;

  restriction.save((err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send({
        message: 'Ocurrió un error al guardar las restricciones. ' + err.message
      });
    } else {
      if (!result) {
        res.status(404).send({
          message: 'No se almacenaron las restricciones'
        });
      } else {
        res.status(200).send(result);
      }
    }
  });
}

function listMaximumInstallments(req, res) {
  var ObjectId = require('mongoose').Types.ObjectId;
  var query = { company_id: new ObjectId(req.params.company_id) };
  Restrictions.findOne(query, (err, result) => {
    if (err) {
      res.status(500).send({
        message: 'Ocurrió un error al consultar el máximo de cuotas por producto y empresa'
      });
    } else {
      res.status(200).send(result);
    }
  }).populate('product_id');
}

function getMaximumInstallments(req, res) {
  var ObjectId = require('mongoose').Types.ObjectId;
  var query = { company_id: new ObjectId(req.params.company_id), product_id: new ObjectId(req.params.product_id) };
  Restrictions.findOne(query, (err, result) => {
    if (err) {
      res.status(500).send({
        message: 'Ocurrió un error al listar el máximo de cuotas por empresa'
      });
    } else {
      if (!result) {
        res.status(200).send({max_installments: 24});
      } else {
        res.status(200).send(result);
      }

    }
  }).populate('product_id');
}

module.exports = {
  save,
  listMaximumInstallments,
  getMaximumInstallments
}
