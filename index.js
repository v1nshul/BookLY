const Koa = require('koa');
const cors = require('@koa/cors');
const app = new Koa();

const special = require('./routes/special.js')
const books = require('./routes/books.js');

// Apply CORS middleware before routes
app.use(cors({
  origin: (ctx) => ctx.request.header.origin, // Allow requests from the same origin as the request
  credentials: true, // Allow credentials (cookies, etc.)
  allowMethods: ['GET', 'POST'], // Allowed HTTP methods
  allowHeaders: ['Content-Type', 'Authorization'] // Allowed headers
}));

// Add routes
app.use(special.routes());
app.use(books.routes()).use(books.allowedMethods());

let port = process.env.PORT || 3000;

// Start server
app.listen(port);
console.log(`API server running on port ${port}`);
