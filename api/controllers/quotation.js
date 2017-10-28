'use strict'

var Quotation = require('../models/quotation');
var mongoose = require('mongoose');
var fs = require('fs');
var PDFDocument = require('pdfkit');
var moment = require('moment');

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
  console.log('executing LIST method for user:', req.user._id);
  console.log('queryParams: ', req.query);

  var queryObject = {};
  if (req.headers['x-selected-company']) {
    var selectedCompanyRole = JSON.parse(decodeURI(req.headers['x-selected-company'])).role;
    if (selectedCompanyRole.startsWith('ROLE_USER')) {
      queryObject = { 'seller._id': req.user.sub };
    }
  }
  if (req.query.started) {
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
  Quotation.count({}, function (err, quotations) {
    if (quotations) {
      console.log('se encontraron ' + quotations + ' cotizaciones');
      Quotation.update(
        {
          _id: req.params.id
        }, {
          $set: {
            status: 'ABIERTA',
            quotationNumber: quotations + 1
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
    } else {
      console.error('no se pudo obtener el numero de la siguiente cotizacion');
      console.error(error);
    }
  });
}

function generateDummyQuotation() {
  return {
    customer: {
      documentNumber: "8356881",
      name: "Daniel",
      surname: "Botero",
      cellphoneNumber: "3148904146"
    },
    quotationNumber: 235,
    date: new Date(),
    status: 'ABIERTA',
    seller: {
      name: "Asesor",
      surname: "35",
      cellphoneNumber: "3006092023"
    },
    items: [
      {
        item: {
          name: "Moto la moto",
          price: 2500000,
          model: 2018,
          cylinder: "250"
        },
        brand: {
          name: "Marca moto"
        },
        installments: 0,
        initialPayment: 0,
        discount: 150000,
        additionalCosts: [
          {
            name: "costo 1",
            value: 350000
          }, {
            name: "costo 2",
            value: 97000
          }
        ],
        paymentValue: 2797000,
        lineTotal: 2797000,
        color: {
          name: "verde fofó"
        }
      }
    ]
  };
}

function generatePDF(req, res) {
  console.log('generando PDF para cotizacion ' + req.params.quotationNumber);

  res.setHeader('Content-disposition', 'attachment; filename="quotation_' + req.params.quotationNumber + '.pdf"')
  res.setHeader('Content-type', 'application/pdf')

  var quotation = generateDummyQuotation();
  //Set page size, orientation and margins
  var pageOptions = {
    //layout: "landscape",
    size: [612, 396],
    margin: 28
  };
  var pdf = new PDFDocument(pageOptions);
  pdf.registerFont('Arial', 'fonts/arial.ttf');
  pdf.registerFont('Arial Bold', 'fonts/arialbd.ttf');

  //Add centered title
  pdf.font('Arial Bold').fontSize(16);
  pdf.text('COTIZACIÓN #' + req.params.quotationNumber, {
    align: 'center'
  });

  //Add customer info
  pdf.fontSize(11);
  pdf.moveDown();
  pdf
    .font('Arial Bold').text('FECHA: ', { continued: true })
    .font('Arial').text(moment().format('YYYY-MM-DD'), { continued: true })
    .font('Arial Bold').text('  CLIENTE: ', { continued: true })
    .font('Arial').text(quotation.customer.name + ' ' + quotation.customer.surname, { continued: true })
    .font('Arial Bold').text('  TEL: ', { continued: true })
    .font('Arial').text(quotation.customer.cellphoneNumber);

  //Add salesman info
  pdf
    .font('Arial Bold').text('ASESOR: ', { continued: true })
    .font('Arial').text(quotation.seller.name + ' ' + quotation.seller.surname, { continued: true })
    .font('Arial Bold').text('  TEL: ', { continued: true })
    .font('Arial').text(quotation.seller.cellphoneNumber);

  //Add products table header
  //var x = 36, y = 80;
  var x = 141;
  pdf.moveDown();
  pdf.font('Arial Bold');
  pdf.text('MOTOCICLETA', { align: 'left', continued: true })
    .text('VL CONTADO', { align: 'left', width: 150 });
  //pdf.text('MOTOCICLETA', { align: 'left', width: 150 }, y , x);
  //x += 150;
  //pdf.text('VL CONTADO', { align: 'left', width: 100 }, y , x);
  //pdf.text('VL TOTAL', { align: 'right', width: 100 });

  pdf.pipe(res);
  pdf.end();
}

module.exports = {
  list,
  save,
  remove,
  createDocument,
  generatePDF
}
