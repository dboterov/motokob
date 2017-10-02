'use strict'

var fs = require('fs');
var path = require('path');
var Factor = require('../models/factor');

function list(req, res) {
    Factor.find().sort('period').exec((err, factors) => {
        if (err) {
            res.status(500).send({
                message: 'error al listar los factores para amortizacion de crédito'
            });
        } else {
            if (!factors) {
                res.status(404).send({
                    message: 'no se encontraron factores para amortizacion de crédito'
                });
            } else {
                return res.status(200).send(factors);
            }
        }
    });
}

module.exports = {
    list
};
