const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const router = Router({ prefix: "/api/home/books" });

const auth = require("../middleware/auth"); // Import auth middleware ✅
const { validateBook } = require("../controllers/validation");
const booksModel = require("../models/books");

async function getAll(ctx) {
  try {
    const userID = ctx.state.user.ID; // Get userID from authentication
    console.log("Fetching books for user ID:", userID); // Debugging line

    const books = await booksModel.getAllByUser(userID);
    
    console.log("Books fetched:", books); // Debugging line
    ctx.status = 200;
    ctx.body = { data: books };
  } catch (error) {
    console.error("Error fetching books:", error);
    ctx.status = 500;
    ctx.body = { error: "Error fetching books" };
  }
}

async function createBook(ctx) {
  const book = ctx.request.body;
  book.userID = ctx.state.user.ID; // Store userID from authentication

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

async function searchBooks(ctx) {
  try {
    const searchQuery = ctx.request.query.query || "";

    if (!searchQuery) {  // Fix: should check searchQuery, not "query"
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

async function addToMyList(ctx) {
  try {
    const { title, author } = ctx.request.body;
    const userID = ctx.state.user.ID;

    if (!title || !author) {
      ctx.status = 400;
      ctx.body = { error: "Title and author are required" };
      return;
    }

    // Check if the book already exists for the user
    const existingBooks = await booksModel.getUserBookByTitle(userID, title);

    if (existingBooks.length > 0) {
      ctx.status = 409; // 409 Conflict
      ctx.body = { error: "Book already exists in your list" };
      return;
    }

    // If not found, add book to user's personal list
    const newBook = await booksModel.add({ title, author, userID });

    ctx.status = 201;
    ctx.body = newBook; // Return the added book
  } catch (error) {
    console.error("Error adding book to list:", error);
    ctx.status = 500;
    ctx.body = { error: "Error adding book" };
  }
}

router.get('/search',auth,searchBooks);
router.get("/", auth, getAll);
router.post("/", auth, bodyParser(), validateBook, createBook);
router.post("/add",auth,bodyParser(), addToMyList);

module.exports = router;
