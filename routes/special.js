const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const router = Router({prefix: '/api/home'});

router.get('/api/home', welcomeAPI);
app.use(router.routes());

function welcomeAPI(ctx, next) {
  ctx.body = {
    message: "Welcome to the Book and Literature API!"
  }
}

module.exports = router;