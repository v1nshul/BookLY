
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const router = Router({ prefix: "/api/home/books" });

const auth = require("../middleware/auth");
const { validateBook } = require("../controllers/validation");
const booksController = require("../controllers/books");

router.get('/search', auth, booksController.searchBooks);
router.get("/", auth, booksController.getAll);
router.post("/", auth, bodyParser(), validateBook, booksController.createBook);
router.post("/add", auth, bodyParser(), booksController.addToMyList);
router.delete("/remove", auth, bodyParser(), booksController.deleteBookFromList);
router.post("/reviews", auth, bodyParser(), booksController.addReview);
router.get("/reviews", auth, booksController.getReviews);

module.exports = router;