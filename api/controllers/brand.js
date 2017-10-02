'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');
var Brand = require('../models/brand');
var jwt = require('../services/jwt');

function list(req, res) {
  console.log('listando marcas registrados');

  Brand.find().sort('name').exec((err, brands) => {
    if (err) {
      res.status(500).send({
        message: 'error al listar las marcas'
      });
    } else {
      if (!brands) {
        res.status(404).send({
          message: 'no se encontraron marcas'
        });
      } else {
        return res.status(200).send({
          brands: brands
        });
      }
    }
  });
}

function findById(req, res) {
  console.log('buscando marca');

  var find = Brand.findOne({
    _id: req.params.id
  }, (err, brand) => {
    if (err) {
      res.status(500).send({
        message: 'ocurrio un error al consultar la informacion de la marca'
      });
    } else if (!brand) {
      res.status(404).send({
        message: 'no se encontró ninguna marca'
      });
    } else {
      res.status(200).send({
        brand: brand
      });
    }
  });
}

function save(req, res) {
  var brand = new Brand();
  var params = req.body;

  brand.name = params.name.toUpperCase();
  brand.logo = params.logo;

  brand.save((err, brandStored) => {
    if (err) {
      res.status(500).send({
        message: 'error al guardar la marca. ' + err.message
      });
    } else {
      if (!brandStored) {
        res.status(404).send({
          message: 'no se registro la marca'
        });
      } else {
        res.status(200).send({
          brand: brandStored
        });
      }
    }
  });
}

function uploadImage(req, res) {
  if (req.files) {
    var images = [];
    console.log('-------------------------------------');
    console.log(req.files);
    console.log('-------------------------------------');
    if (req.files.image.length > 1) {
      for (var i = 0; i < req.files.image.length; i++) {
        var filePath = req.files.image[i].path;
        var fileSplit = filePath.split('\\');
        var fileName = fileSplit[2];
        var extSplit = fileName.split('\.');
        var fileExt = extSplit[1];

        console.log(fileName);
        images.push(fileName);
      }
    } else {
      var filePath = req.files.image.path;
      var fileSplit = filePath.split('\\');
      var fileName = fileSplit[2];
      var extSplit = fileName.split('\.');
      var fileExt = extSplit[1];

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
  var path_file = './uploads/brands/' + imageFile;

  console.log(imageFile);
  console.log(path_file);

  fs.exists(path_file, function(exists) {
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
  list,
  findById,
  save,
  uploadImage,
  getImageFile
};
