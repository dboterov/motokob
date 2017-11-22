'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');

function list(req, res) {
  var page = parseInt(req.query.page ? req.query.page : 1);
  var pageSize = parseInt(req.query.pageSize ? req.query.pageSize : 10000);
  var showActiveOnly = req.query.showActiveOnly;

  console.log('listing users. page: ' + page + ', pageSize: ' + pageSize + ', showActiveOnly:' + showActiveOnly);

  var filterObject = {};
  if (showActiveOnly == 'true') {
    filterObject = { active: true };
  }

  User.find(filterObject, (err, user) => {
    if (err) {
      res.status(500).send({
        message: 'ocurrio un error al listar los usuarios'
      });
    } else {
      res.status(200).send({
        users: user
      });
    }
  }).sort('name').sort('surname').sort('username').paginate(page, pageSize);
}

function saveUser(req, res) {
  var user = new User();
  var params = req.body;

  user.name = params.name;
  user.surname = params.surname;
  user.username = params.username.toLowerCase();
  user.active = true;
  user.permissions = params.permissions;

  if (params.password) {
    bcrypt.hash(params.password, null, null, function (err, hash) {
      user.password = hash;
      if (user.name != null && user.surname != null && user.username != null) {
        user.save((err, userStored) => {
          if (err) {
            console.error(err);
            res.status(500).send({
              message: 'error al guardar el usuario'
            });
          } else if (!userStored) {
            res.status(404).send({
              message: 'no se registro el usuario'
            });
          } else {
            res.status(200).send({
              user: userStored
            });
          }
        });
      } else {
        res.status(200).send({
          message: 'introduce todos los campos del usuario'
        });
      }
    });
  } else {
    res.status(200).send({
      message: 'introduce la contraseña'
    });
  }
}

function loginUser(req, res) {
  if (typeof req.body.username === 'undefined') {
    console.error('no se recibieron datos para validar');
    res.status(500).send({
      message: 'no se recibieron datos en el body'
    });
  } else {
    var params = req.body;

    var username = params.username;
    var password = params.password;

    User.findOne({
      username: username.toLowerCase()
    }, (err, user) => {
      if (err) {
        console.error(err);
        res.status(500).send({
          message: 'datos incorrectos'
        });
      } else if (!user || !user.active) {
        console.error('usuario no encontrado o inactivo');
        res.status(404).send({
          message: 'usuario no existe'
        });
      } else {
        bcrypt.compare(password, user.password, function (err, check) {
          if (check) {
            if (params.gethash) {
              // devolver token jwt
              res.status(200).send({
                token: jwt.createToken(user)
              });
            } else {
              res.status(200).send({
                user
              });
            }
          } else {
            console.error('contraseña no valida');
            res.status(404).send({
              message: 'usuario no valido'
            });
          }
        });
      }
    });
  }
}

function updateUser(req, res) {
  var userId = req.params.id;
  var update = req.body;

  User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
    if (err) {
      res.status(500).send({
        message: 'ocurrio un error al actualizar la informacion del usuario'
      });
    } else if (!userUpdated) {
      res.status(404).send({
        message: 'no se recibio la informacion actualizada del usuario'
      });
    } else {
      res.status(200).send({
        user: userUpdated
      });
    }
  });
}

function changePassword(req, res) {
  var update = req.body;
  if (update.password) {
    bcrypt.hash(update.password, null, null, function (err, hash) {
      update.password = hash;
      if (update.name != null && update.surname != null && update.username != null) {
        User.findByIdAndUpdate(req.params.id, update, (err, userUpdated) => {
          if (err) {
            res.status(500).send({
              message: 'ocurrio un error al actualizar la contraseña del usuario'
            });
          } else if (!userUpdated) {
            res.status(404).send({
              message: 'no se recibió la información actualizada del usuario'
            });
          } else {
            res.status(200).send({
              user: userUpdated
            });
          }
        });
      } else {
        res.status(200).send({
          message: 'introduce todos los campos del usuario'
        });
      }
    });
  } else {
    res.status(200).send({
      message: 'debes ingresar una contraseña'
    });
  }
}

function findUser(req, res) {
  User.findOne({ username: req.params.username }, (err, user) => {
    if (err) {
      res.status(500).send({
        message: 'ocurrio un error al consultar el usuario'
      });
    } else {
      res.status(200).send(user);
    }
  });
}

module.exports = {
  saveUser,
  loginUser,
  updateUser,
  list,
  changePassword,
  findUser
};
