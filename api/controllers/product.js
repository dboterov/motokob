'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');
var Product = require('../models/product');
var ProductType = require('../models/productType');
var jwt = require('../services/jwt');
var mongoose = require('mongoose');

function productsList(req, res) {
  var page = parseInt(req.query.page ? req.query.page : 1);
  var pageSize = parseInt(req.query.pageSize ? req.query.pageSize : 10);
  var strFilter = req.query.strFilter;
  var brandId = req.query.brandId;

  var queryObject = { "active": true };
  console.log("request params: ", req.params);

  if (strFilter) {
    var orOptions = [];
    orOptions.push({ "name": new RegExp(strFilter, "i") });
    orOptions.push({ "cylinder": new RegExp(strFilter, "i") });
    if (!isNaN(parseInt(strFilter))) {
      orOptions.push({ "model": strFilter });
    }

    console.log('opciones or: ', orOptions);

    queryObject = {
      $and: [
        { "active": true },
        { $or: orOptions }
      ]
    }
  } else if (brandId) {
    queryObject = {
      $and: [
        { "active": true },
        { "brand": brandId }
      ]
    }
  }
  console.log('consultando productos', queryObject);

  Product.find(queryObject).count({}, (err, count) => {
    Product.find(queryObject).sort('name').paginate(page, pageSize)
      .populate({
        path: 'productType',
        model: 'ProductType'
      }).populate({
        path: 'brand',
        model: 'Brand'
      }).exec((err, products) => {
        if (err) {
          console.error(err);
          res.status(500).send({
            message: 'error al listar los productos'
          });
        } else {
          if (!products) {
            res.status(404).send({
              message: 'no se encontraron productos'
            });
          } else {
            return res.status(200).send({
              records: count,
              products: products
            });
          }
        }
      });
  })/*.populate({
    path: 'productType'
  })*/;
}

function saveProduct(req, res) {
  var product = new Product();
  var params = req.body;

  console.log('creando producto: ', params);

  product.name = params.name;
  product.brand = params.brand;
  product.model = params.model;
  product.cylinder = params.cylinder;
  product.productType = params.productType;
  product.colors = params.colors;
  product.price = params.price;
  product.images = params.images;
  product.active = true;

  product.save((err, productStored) => {
    if (err) {
      res.status(500).send({
        message: 'error al guardar el producto. ' + err.message
      });
    } else if (!productStored) {
      res.status(404).send({
        message: 'no se registro el producto'
      });
    } else {
      res.status(200).send({
        product: productStored
      });
    }
  });
}

function updateProduct(req, res) {
  console.log(req.body);
  var product = new Product();
  var params = req.body;

  product._id = params._id;
  product.name = params.name;
  product.brand = params.brand;
  product.model = params.model;
  product.cylinder = params.cylinder;
  product.productType = params.productType;
  product.colors = params.colors;
  product.price = params.price;
  product.images = params.images;
  product.active = params.active;

  Product.findByIdAndUpdate(params._id, product, (err, productUpdated) => {
    if (err) {
      res.status(500).send({
        message: 'ocurrio un error al actualizar la informacion del producto'
      });
    } else {
      if (!productUpdated) {
        res.status(404).send({
          message: 'no se recibio la informacion actualizada del producto'
        });
      } else {
        res.status(200).send({
          product: productUpdated
        });
      }
    }
  });
}

function uploadImage(req, res) {
  var productId = req.params.id;

  if (req.files) {
    var images = [];
    //console.log('-------------------------------------');
    //console.log(req.files);
    //console.log('-------------------------------------');
    if (req.files.image.length > 1) {
      for (var i = 0; i < req.files.image.length; i++) {
        var filePath = req.files.image[i].path;
        var fileSplit = filePath.split('\\');
        var fileName = fileSplit[2];
        var extSplit = fileName.split('\.');
        var fileExt = extSplit[1];

        //console.log(fileName);
        images.push(fileName);
      }
    } else {
      var filePath = req.files.image.path;
      var fileSplit = filePath.split('\\');
      var fileName = fileSplit[2];
      var extSplit = fileName.split('\.');
      var fileExt = extSplit[1];

      //console.log(fileName);
      images.push(fileName);
    }

    res.status(200).send({
      images: images
    });
  } else {
    res.status(200).send({
      message: 'no subiste ninguna imagen'
    });
  }
}

function getImageFile(req, res) {
  var imageFile = req.params.imageFile;
  var path_file = './uploads/products/' + imageFile;

  fs.exists(path_file, function (exists) {
    if (exists) {
      res.sendFile(path.resolve(path_file));
    } else {
      res.status(200).send({
        message: 'No se encontro la imagen...'
      });
    }
  });
}

module.exports = {
  productsList,
  saveProduct,
  updateProduct,
  uploadImage,
  getImageFile
};
