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

// Use auth middleware to protect these routes
router.get("/", auth, getAll);
router.post("/", auth, bodyParser(), validateBook, createBook);

module.exports = router;
