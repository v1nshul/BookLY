const Koa = require('koa');
const cors = require('@koa/cors');
const Router = require('koa-router');
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const serve = require('koa-static');
const passport = require('koa-passport'); 
const { login, authenticate } = require('./controllers/auth'); 
const authMiddleware = require('./middleware/auth');

const app = new Koa();
const router = new Router();

const special = require('./routes/special.js');
const books = require('./routes/books.js');

const openApiFilePath = path.join(__dirname, 'docs', 'openapi.yaml');
const openApiYaml = fs.readFileSync(openApiFilePath, 'utf8');
const openApiJson = yaml.load(openApiYaml);

app.use(cors({
  origin: (ctx) => ctx.request.header.origin,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE', 'PUT' , 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization']
}));

app.use(passport.initialize());

app.use(serve(path.join(__dirname, 'public')));
app.use(serve(path.join(__dirname, 'docs')));

router.get('/docs/yaml', (ctx) => {
  ctx.set('Content-Type', 'text/yaml'); 
  ctx.body = openApiYaml;
});

router.get('/docs/json', (ctx) => {
  ctx.set('Content-Type', 'application/json');
  ctx.body = openApiJson;
});

router.get('/docs/jsdoc/', (ctx) => {
  ctx.redirect('/jsdoc/index.html'); 
});

router.get('/docs/', (ctx) => {
  ctx.type = 'text/html';
  ctx.body = fs.readFileSync(path.join(__dirname, 'public', 'index.html'));
});

// Login route to generate JWT
router.post('/login', login);

router.get('/api/protected', authMiddleware, (ctx) => {
  ctx.body = { message: `Hello, ${ctx.state.user.username}! This is protected.` };
});

router.use('/api/home/books', authMiddleware, books.routes(), books.allowedMethods());


app.use(router.routes()).use(router.allowedMethods());
app.use(special.routes()).use(special.allowedMethods());
app.use(books.routes()).use(books.allowedMethods());


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API server running on port ${port}`);
});

module.exports = app;