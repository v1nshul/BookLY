
const booksModel = require("../models/books");
const reviewsModel = require("../models/reviews");

/**
 * Get all books for the authenticated user
 * @param {Object} ctx - The Koa context object
 */
async function getAll(ctx) {
  try {
    const userID = ctx.state.user.ID; 
    console.log("Fetching books for user ID:", userID);

    const books = await booksModel.getAllByUser(userID);
    
    console.log("Books fetched:", books);
    ctx.status = 200;
    ctx.body = { data: books };
  } catch (error) {
    console.error("Error fetching books:", error);
    ctx.status = 500;
    ctx.body = { error: "Error fetching books" };
  }
}

/**
 * Create a new book entry
 * @param {Object} ctx - The Koa context object
 */
async function createBook(ctx) {
  const book = ctx.request.body;
  book.userID = ctx.state.user.ID;

  try {
    const result = await booksModel.add(book);
    ctx.status = 201;
    ctx.body = result;
  } catch (err) {
    console.error("Error creating book:", err);
    ctx.status = 500;
    ctx.body = { error: err.message };
  }
}

/**
 * Search for books based on a query string
 * @param {Object} ctx - The Koa context object
 */
async function searchBooks(ctx) {
  try {
    const searchQuery = ctx.request.query.query || "";

    if (!searchQuery) {
      ctx.status = 400;
      ctx.body = { error: "Search query is required" };
      return;
    }

    console.log("Searching for books with query:", searchQuery);
    const books = await booksModel.searchBooks(searchQuery);

    ctx.status = 200;
    ctx.body = { data: books };
  } catch (error) {
    console.error("Error searching books:", error);
    ctx.status = 500;
    ctx.body = { error: "Error searching books" };
  }
}


/**
 * Add a book to the authenticated user's list
 * @param {Object} ctx - The Koa context object
 */
async function addToMyList(ctx) {
  try {
    const { title, author } = ctx.request.body;
    const userID = ctx.state.user.ID;

    if (!title || !author) {
      ctx.status = 400;
      ctx.body = { error: "Title and author are required" };
      return;
    }

    const existingBooks = await booksModel.getUserBookByTitle(userID, title);

    if (existingBooks.length > 0) {
      ctx.status = 409; 
      ctx.body = { error: "Book already exists in your list" };
      return;
    }
    const newBook = await booksModel.add({ title, author, userID });

    ctx.status = 201;
    ctx.body = newBook;
  } catch (error) {
    console.error("Error adding book to list:", error);
    ctx.status = 500;
    ctx.body = { error: "Error adding book" };
  }
}


/**
 * Remove a book from the authenticated user's list
 * @param {Object} ctx - The Koa context object
 */
async function deleteBookFromList(ctx) {
  try {
    console.log('Authenticated user:', ctx.state.user);

    const { title, author } = ctx.request.body;
    const userID = ctx.state.user.ID;

    if (!title || !author) {
      ctx.status = 400;
      ctx.body = { error: "Book title and author are required" };
      return;
    }

    const result = await booksModel.delFromUserList(title, author, userID);

    if (result.message === 'book not found') {
      ctx.status = 404;
      ctx.body = { error: 'Book not found' };
      return;
    }

    ctx.status = 200;
    ctx.body = { message: result.message };
  } catch (error) {
    console.error("Error deleting book from list:", error);
    ctx.status = 500;
    ctx.body = { error: "An error occurred while deleting the book from your list" };
  }
}


/**
 * Add a review for a book
 * @param {Object} ctx - The Koa context object
 */
async function addReview(ctx) {
  const { book_id, rating, comment } = ctx.request.body;
  const user_id = ctx.state.user.ID; 

  if (!book_id || !rating) {
    ctx.status = 400;
    ctx.body = { error: "Book ID and rating are required" };
    return;
  }

  try {
    const result = await reviewsModel.addReview({ book_id, user_id, rating, comment });
    ctx.status = 201;
    ctx.body = result;
  } catch (error) {
    console.error("Error adding review:", error);
    ctx.status = 500;
    ctx.body = { error: "Error adding review" };
  }
}


/**
 * Get reviews for a specific book
 * @param {Object} ctx - The Koa context object
 */
async function getReviews(ctx) {
  const { book_id } = ctx.request.query;

  if (!book_id) {
    ctx.status = 400;
    ctx.body = { error: "Book ID is required" };
    return;
  }

  try {
    const reviews = await reviewsModel.getReviewsByBookId(book_id);
    ctx.status = 200;
    ctx.body = { data: reviews };
  } catch (error) {
    console.error("Error fetching reviews:", error);
    ctx.status = 500;
    ctx.body = { error: "Error fetching reviews" };
  }
}

module.exports = {
  getAll,
  createBook,
  searchBooks,
  addToMyList,
  deleteBookFromList,
  addReview,
  getReviews
};