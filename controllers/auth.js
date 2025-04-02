const passport = require('koa-passport');
const basicAuth = require('../strategies/basic');
const jwtAuth = require('../strategies/jwt');
const jwt = require('jsonwebtoken');

passport.use(basicAuth);
passport.use(jwtAuth);

const login = async (ctx) => {
  return passport.authenticate('basic', { session: false }, (err, user) => {
    if (err || !user) {
      ctx.status = 401;
      ctx.body = { error: 'Invalid credentials' };
      return;
    }
    const payload = { username: user.username };
    const token = jwt.sign(payload, 'your-secret-key', { expiresIn: '1h' });
    ctx.status = 200;
    ctx.body = { token, message: 'Logged in successfully' };
  })(ctx);
};

const authenticate = passport.authenticate('jwt', { session: false });

module.exports = { login, authenticate };