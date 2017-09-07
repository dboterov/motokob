'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//cargar rutas
var user_routes = require('./routes/user');
var customer_routes = require('./routes/customer');
var region_routes = require('./routes/region');
var product_routes = require('./routes/product');
var brand_routes = require('./routes/brand');
var productType_routes = require('./routes/productType');
var company_routes = require('./routes/company');

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

//configurar cabeceras http
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Access', 'GET, POST, OPTIONS, PUT, DELETE');

    next();
});

//rutas base
app.use('/api/user', user_routes);
app.use('/api/customer', customer_routes);
app.use('/api/region', region_routes);
app.use('/api/product', product_routes);
app.use('/api/brand', brand_routes);
app.use('/api/productType', productType_routes);
app.use('/api/company', company_routes);

module.exports = app;
