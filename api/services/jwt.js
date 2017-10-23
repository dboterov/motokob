'user strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = '?}U^;N3XU_Yq7~Y{NdD]_*R=(x4"1>';

exports.createToken = function (user) {
  console.log('creating token for user: ', user);
  var payload = {
    sub: user._id,
    name: user.name,
    surname: user.surname,
    email: user.email,
    role: user.role,
    companies: user.companies,
    iat: moment().unix(),
    exp: moment().add(12, 'hours').unix()
  };

  return jwt.encode(payload, secret);
};
