const Koa = require('koa');
const cors = require('@koa/cors');
const app = new Koa();

const special = require('./routes/special.js')
const books = require('./routes/books.js');

app.use(special.routes());
app.use(books.routes());


let port = process.env.PORT || 3000;

app.listen(port);
console.log(`API server running on port ${port}`)
