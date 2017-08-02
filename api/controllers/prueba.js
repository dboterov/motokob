'use strict'

var fs = require('fs');
var path = require('path');

function getImageFile(req, res) {
  var imageFile = req.params.imageFile;
  var filePath = './uploads/images/' + imageFile;
  fs.exists(filePath, function(exists) {
    if (exists) {
      res.sendFile(path.resolve(filePath));
    } else {
      res.status(200).send({
        message: 'la imagen no existe'
      });
    }
  });
}

function uploadImage(req, res) {
  if (req.files) {
    console.log(req.files);

    var filePath = req.files.image.path;
    var fileSplit = filePath.split('\\');
    var fileName = fileSplit[2];
    var extSplit = fileName.split('\.');
    var fileExt = extSplit[1];

    res.status(200).send({
      message: 'ok',
      image: fileName
    });
  } else {
    res.status(200).send({
      message: 'no subiste ninguna imagen'
    });
  }
}

module.exports = {
  getImageFile,
  uploadImage
};
