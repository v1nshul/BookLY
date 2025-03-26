const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const router = Router({ prefix: '/api/home/books' });

const { validateBook } = require('../controllers/validation');
const booksModel = require('../models/books'); // Import the model

async function getAll(ctx) {
  try {
    const books = await booksModel.getAll(); // Assuming booksModel.getAll() fetches books
    ctx.status = 200;
    ctx.body = { data: books };
  } catch (error) {
    console.error('Error fetching books:', error);
    ctx.status = 500;
    ctx.body = { error: 'Error fetching books' };
  }
}


async function getById(ctx) {
  const id = parseInt(ctx.params.id);
  try {
    const book = await booksModel.getById(id);
    if (book.length > 0) {
      ctx.body = book[0];
    } else {
      ctx.status = 404;
      ctx.body = { error: 'Book not found' };
    }
  } catch (err) {
    ctx.status = 500;
    ctx.body = { error: err.message };
  }
}

async function createBook(ctx) {
  const book = ctx.request.body;
  try {
    const result = await booksModel.add(book);
    ctx.status = 201;
    ctx.body = result;
  } catch (err) {
    ctx.status = 500;
    ctx.body = { error: err.message };
  }
}

async function updateBook(ctx) {
  const id = parseInt(ctx.params.id);
  const book = { ...ctx.request.body, ID: id };
  try {
    const result = await booksModel.update(book);
    if (result.affectedRows > 0) {
      ctx.body = { message: 'Book updated successfully' };
    } else {
      ctx.status = 404;
      ctx.body = { error: 'Book not found' };
    }
  } catch (err) {
    ctx.status = 500;
    ctx.body = { error: err.message };
  }
}

async function deleteBook(ctx) {
  const id = parseInt(ctx.params.id);
  try {
    const result = await booksModel.delById(id);
    if (result.affectedRows > 0) {
      ctx.body = { message: 'Book deleted successfully' };
    } else {
      ctx.status = 404;
      ctx.body = { error: 'Book not found' };
    }
  } catch (err) {
    ctx.status = 500;
    ctx.body = { error: err.message };
  }
}

router.get('/', getAll);
router.post('/', bodyParser(), validateBook, createBook);
router.get('/:id([0-9]{1,})', getById);
router.put('/:id([0-9]{1,})', bodyParser(), validateBook, updateBook);
router.del('/:id([0-9]{1,})', deleteBook);
module.exports = router;
