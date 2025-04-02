const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const users = require('../models/users');

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'your-secret-key' 
};

const strategy = new JwtStrategy(opts, async (jwtPayload, done) => {
  try {
    const result = await users.findByUsername(jwtPayload.username);
    if (result.length) return done(null, result[0]);
    return done(null, false);
  } catch (error) {
    return done(error);
  }
});

module.exports = strategy;