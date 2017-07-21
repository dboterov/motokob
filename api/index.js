'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/motokob', (err, res) => {
    if (err) {
        throw err;
    } else {
        console.log('conexion exitosa a mongodb motokob');

        app.listen(port, function () {
            console.log('API REST escuchando en http://localhost:' + port);
        });
    }
});
