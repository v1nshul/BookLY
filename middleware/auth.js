const passport = require('koa-passport');

const auth = async (ctx, next) => {
  return passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) {
      ctx.status = 401;
      ctx.body = { error: 'Unauthorized' };
      return;
    }
    ctx.state.user = user;
    return next();
  })(ctx, next);
};

module.exports = auth;