'user strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = '?}U^;N3XU_Yq7~Y{NdD]_*R=(x4"1>';

exports.createToken = function(user) {
  var payload = {
    sub: user._id,
    name: user.name,
    surname: user.surname,
    email: user.email,
    role: user.role,
    iat: moment().unix(),
    exp: moment().add(30, 'days').unix()
  };

  return jwt.encode(payload, secret);
};
