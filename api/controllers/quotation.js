'use strict'

var Quotation = require('../models/quotation');
var mongoose = require('mongoose');

function save(req, res) {
  var quotation = new Quotation();

  quotation.items = req.body.items;
  quotation.seller = req.body.seller;
  quotation.customer = req.body.customer;
  quotation.date = req.body.date;
  quotation.status = req.body.status;

  if (req.params.id) {
    quotation._id = req.body._id;
    Quotation.findByIdAndUpdate(req.params.id, quotation, (err, result) => {
      console.log('termino de buscar y actualizar');
      if (err) {
        console.error(err);
        res.status(500).send({
          message: 'Ocurrió un error al modificar la cotización. ' + err.message
        });
      } else {
        if (!result) {
          res.status(404).send({
            message: 'No se modificó la cotización'
          });
        } else {
          res.status(200).send({ quotation: result });
        }
      }
    });
  } else {
    quotation.save((err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send({
          message: 'Ocurrió un error al guardar la cotizacion. ' + err.message
        });
      } else {
        if (!result) {
          res.status(404).send({
            message: 'No se guardo la cotizacion'
          });
        } else {
          res.status(200).send({ quotation: result });
        }
      }
    });
  }
}

function list(req, res) {
  console.log('executing LIST method for user:', req.user);
  console.log('queryParams: ', req.query);
  console.log('company: ', req.headers.company);
  
  var queryObject = {};
  if (req.query.started) {
    queryObject = { 'seller._id': req.user.sub };
    queryObject.status = 'INICIADA';
  }
  if (req.query) {
    if (req.query._id) {
      queryObject._id = req.query._id;
    }
    if (req.query.customer) {
      queryObject.customer._id = req.query.customer;
    }
  }
  console.log('queryObject: ', queryObject);
  Quotation.find(queryObject, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      console.log('resultado de la busqueda: ', result);
      if (!result) {
        res.status(404).send({ message: 'No se encontraron cotizaciones' });
      } else {
        res.status(200).send(result);
      }
    }
  }).sort('-date');
}

function remove(req, res) {
  if (req.params) {
    Quotation.remove({ _id: req.params.id }, (err, result) => {
      if (err) {
        console.error(err);
      } else {
        console.log(result);
        if (!result) {
          console.error('no fue posible eliminar la cotizacion');
        } else {
          res.status(200).send(result);
        }
      }
    });
  } else {
    res.status(400).send({ message: 'No se recibió el id de la cotización para eliminar' });
  }
}

function createDocument(req, res) {
  console.log('asigning document number to quotation ' + req.params.id);
  mongoose.connection.db.eval("getNextSequence('quotationId')", function (err, retVal) {
    console.log('next quotation number: ' + retVal);
    Quotation.update(
      {
        _id: req.params.id
      }, {
        $set: {
          status: 'ABIERTA',
          documentNumber: retVal
        }
      }, (err, result) => {
        console.log('termino de buscar y actualizar');
        if (err) {
          console.error(err);
          res.status(500).send({
            message: 'Ocurrió un error al modificar la cotización. ' + err.message
          });
        } else {
          if (!result) {
            res.status(404).send({
              message: 'No se modificó la cotización'
            });
          } else {
            res.status(200).send({ quotation: result });
          }
        }
      }
    );
  });
}

module.exports = {
  list,
  save,
  remove,
  createDocument
}
