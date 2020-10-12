const config = require ('./db');
const User = require ('../models/user');

var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

module.exports = function (passport) {
  var opts = {}  //опции по поводу авторизации,пуст объект
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); //какой тип авторизации испол-ся
  opts.secretOrKey = config.secret;   //секретный ключ
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {  //наша стратегия,JwtStrategy - объект, 1jwt_payload, 2done - 1пользователь,который хочет авторизоваться
      User.findOne({id: jwt_payload.sub}, function(err, user) {
          if (err) {
              return done(err, false);
          }
          if (user) {
              return done(null, user);
          } else {
              return done(null, false);
              // or you could create a new account
          }
      });
  }));
}
