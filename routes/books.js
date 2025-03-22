const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const router = Router({prefix: '/api/home/books'});

let books = [
  {
    title:'sample book',
    fullText:'some text here to fill the body',
    creationDate: new Date(),
    editedDate: new Date(),
    views: 0
  },
  {
    title:'another book',
    fullText:'again here is some text here to fill',
    creationDate: new Date(),
    editedDate: new Date(),
    views: 0
  },
  {
    title:'hmm ',
    fullText:'some news about hmm',
    creationDate: new Date(),
    editedDate: new Date(),
    views: 0
  }
];
router.get('/',getAll);
router.post('/',bodyParser(), createBook);

router.get('/:id([0-9]{1,})', getById);
router.put('/:id([0-9]{1,})', updateBook);  
router.del('/:id([0-9]{1,})', deleteBook);  

function getAll(cnx, next){  
  // Use the response body to send the articles as JSON.
  cnx.body = books;  
}  

function getById(cnx, next){
  // Get the ID from the route parameters.
  let id = cnx.params.id;  

  // If it exists then return the article as JSON.
  // Otherwise return a 404 Not Found status code
  if ((id < books.length+1) && (id > 0)) {
    cnx.body = books[id-1];
  } else {
    cnx.status = 404;
  }
}

function createBook(cnx, next) {
  // The body parser gives us access to the request body on cnx.request.body.
  // Use this to extract the title and fullText we were sent.
  let {title, fullText} = cnx.request.body;
  // In turn, define a new article for addition to the array.
  let newBook = {title:title, fullText:fullText};
  articles.push(newBook);
  // Finally send back appropriate JSON and status code.
  // Once we move to a DB store, the newArticle sent back will now have its ID.
  cnx.status = 201;
  cnx.body = newBook;
}  

function updateBook(cnx, next){  
  const id = cnx.params.id;
  const body = cnx.request.body;
  let {title, fullText} = body;
  newValues = {title:title, fullText:fullText, editedDate:new Date()};
  Object.assign(books[id - 1], newValues)  // merge new values into article
  cnx.body = books[id - 1];
}  

function deleteBook(cnx, next){  
   
  const id = cnx.params.id;
  books = books.filter((item, index) => index !== id - 1);
  cnx.status = 200
}  

// Finally, define the exported object when 'require'd from other scripts. 
module.exports = router;



