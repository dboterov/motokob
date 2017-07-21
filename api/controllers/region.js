'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var State = require('../models/state');
var City = require('../models/city');
var mongoose = require('mongoose');

function listStates(req, res) {
  console.log('listando departamentos');

  State.find({}, (err, result2) => {
    if (err) {
      res.status(500).send({
        message: 'ocurrio un error al listar los departamentos'
      });
    } else {
      res.status(200).send({
        states: result2
      });
    }
  }).sort('name');
}

function listCities(req, res) {
  console.log('listando ciudades para el dpto ' + req.params.stateId);
  if (!req.params.stateId) {
    res.status(404).send({
      message: 'Se debe indicar un departamento para lista sus ciudades'
    });
  } else {
    City.find({
      state: req.params.stateId
    }, (err, result2) => {
      if (err) {
        res.status(500).send({
          message: 'ocurrio un error al listar las ciudades'
        });
      } else {
        res.status(200).send({
          cities: result2
        });
      }
    }).sort('code');
  }
}

module.exports = {
  listStates,
  listCities
};
