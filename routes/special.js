const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const auth = require('../controllers/auth');
const usersModel = require('../models/users');
const bcrypt = require('bcrypt');
const booksModel = require('../models/books');

const router = Router({prefix: '/api/home'});

router.get('/', publicAPI);
router.get('/private', auth, privateAPI);

router.post('/register', bodyParser(), async (ctx) => {
  try {
    const { username, password, email } = ctx.request.body;
    
    console.log("🔹 Raw Password Before Hashing:", password); // Debugging
    const hashedPassword = bcrypt.hashSync(password, 10);
    console.log("🔹 Hashed Password Before Storing:", hashedPassword); // Debugging

    const newUser = { username, password: hashedPassword, email };
    await usersModel.add(newUser);

    ctx.status = 201;
    ctx.body = { message: "User registered successfully" };
  } catch (error) {
    console.error("Error registering user:", error);
    ctx.status = 500;
    ctx.body = { error: "Internal Server Error" };
  }
});

router.post('/books', auth, bodyParser(), async (ctx) => {
  console.log("Book Add Request Received!");
  console.log("Request Body:", ctx.request.body);
  
  const { title, author } = ctx.request.body;
  const userID = ctx.state.user.ID; // Get authenticated user ID

  if (!title || !author) {
    console.log("Missing fields!");
    ctx.status = 400;
    ctx.body = { error: "Title and author are required" };
    return;
  }

  try {
    console.log("🛠 Adding book to DB...");
    await booksModel.add({ title, author, userID });
    console.log("Book added successfully!");

    ctx.status = 201;
    ctx.body = { message: "Book added successfully" };
  } catch (error) {
    console.error("Error adding book:", error);
    ctx.status = 500;
    ctx.body = { error: "Internal Server Error" };
  }
});


function publicAPI(ctx) {  
  ctx.body = {message: 'PUBLIC PAGE: You requested a new message URI (root) of the API'}
}

function privateAPI(ctx) {
  const user = ctx.state.user;
  ctx.body = {message: `Hello ${user.username} you registered on ${user.dateRegistered}`} 
}

module.exports = router;