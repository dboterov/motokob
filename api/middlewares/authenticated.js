'user strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = '?}U^;N3XU_Yq7~Y{NdD]_*R=(x4"1>';

exports.ensureAuth = function(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send({
      message: 'usuario no autorizado'
    });
  }
  var token = req.headers.authorization.replace(/['"]+/g, '');
  try {
    var payload = jwt.decode(token, secret);
    if (payload.exp <= moment().unix()) {
      return res.status(401).send({
        message: 'el token ha expirado'
      });
    }
    req.user = payload;
    next();
  } catch (ex) {
    return res.status(401).send({
      message: 'token no valido',
      error: ex
    });
  }
};
