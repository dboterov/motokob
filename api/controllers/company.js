'use strict'

var Company = require('../models/company');

function list(req, res) {
  Company.find({active: true}).sort('name').exec((err, companies) => {
    if (err) {
      console.error(err);
      res.status(500).send({
        message: 'error al listar las empresas'
      });
    } else {
      return res.status(200).send(companies);
    }
  });
}

function save(req, res) {
  var company = new Company();
  var params = req.body;

  company.name = params.name;
  company.active = true;

  company.save((err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send({
        message: 'error al crear la empresa. ' + err.message
      });
    } else {
      if (!result) {
        res.status(404).send({
          message: 'no se registró la empresa'
        });
      } else {
        res.status(200).send(result);
      }
    }
  });
}

module.exports = {
  list,
  save
};
