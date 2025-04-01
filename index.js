const Koa = require('koa');
const cors = require('@koa/cors');

const app = new Koa();

const special = require('./routes/special.js')
const books = require('./routes/books.js');


app.use(cors({
  origin: (ctx) => ctx.request.header.origin, 
  credentials: true, 
  allowMethods: ['GET', 'POST','DELETE' , 'PUT'], 
  allowHeaders: ['Content-Type', 'Authorization'] 
}));

app.use(special.routes());
app.use(books.routes()).use(books.allowedMethods());

let port = process.env.PORT || 3000;


app.listen(port);
console.log(`API server running on port ${port}`);
