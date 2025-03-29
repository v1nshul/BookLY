const db = require('../helpers/database');

//get a single article by its id  
exports.getById = async function getById (id) {
  const query = "SELECT * FROM books WHERE ID = ?;";
  const values = [id];
  const data = await db.run_query(query, values);
  return data;
};

exports.getAllByUser = async function getAllByUser(userID) {
  try {
    const query = `
      SELECT b.id, b.title, b.author 
      FROM books b
      JOIN user_books ub ON b.id = ub.bookID
      WHERE ub.userID = ?;
    `;
    const data = await db.run_query(query, [userID]);
    return data;
  } catch (error) {
    console.error("Error fetching user's books:", error);
    throw error;
  }
};

exports.searchBooks = async function searchBooks(query) {
  try {
    const sql = `SELECT title, author FROM books WHERE LOWER(title) LIKE LOWER(?) OR LOWER(author) LIKE LOWER(?)`;
    const values = [`%${query}%`, `%${query}%`];

    const result = await db.run_query(sql, values); // Use `run_query()`
    return result;
  } catch (error) {
    console.error("Error searching books:", error);
    throw error;
  }
};

exports.getUserBookByTitle = async function getUserBookByTitle(userID, title) {
  try {
    const sql = `SELECT * FROM books WHERE userID = ? AND LOWER(title) = LOWER(?)`;
    const values = [userID, title];

    const result = await db.run_query(sql, values);
    return result; // Returns an array (empty if no match)
  } catch (error) {
    console.error("Error checking for duplicate book:", error);
    throw error;
  }
};

exports.add = async function add(book) {
  const { title, author, userID } = book;

  try {
    let query = "SELECT id FROM books WHERE title = ? AND author = ?";
    let results = await db.run_query(query, [title, author]);

    let bookID;
    if (results.length > 0) {
      bookID = results[0].id; 
    } else {
      
      query = "INSERT INTO books (title, author) VALUES (?, ?)";
      const insertResult = await db.run_query(query, [title, author]);
      bookID = insertResult.insertId;
    }

    query = "SELECT id FROM user_books WHERE userID = ? AND bookID = ?";
    results = await db.run_query(query, [userID, bookID]);

    if (results.length > 0) {
      return { message: "Book already in your list!" }; 
    }

    query = "INSERT INTO user_books (userID, bookID) VALUES (?, ?)";
    await db.run_query(query, [userID, bookID]);

    return { message: "Book added to your list!", bookID };
  } catch (error) {
    console.error("Error adding book:", error);
    throw error;
  }
};


exports.delFromUserList = async function delFromUserList(title, author, userID) {
  try {
    
    const query = 'SELECT id FROM books WHERE title = ? AND author = ?';
    const bookResults = await db.run_query(query, [title, author]);

    if (bookResults.length === 0) {
      return { message: 'book not found' }; 
    }

    const bookID = bookResults[0].id; 

    
    const deleteQuery = 'DELETE FROM user_books WHERE bookID = ? AND userID = ?';
    await db.run_query(deleteQuery, [bookID, userID]);

    return { message: 'book deleted from your list' }; 
  } catch (error) {
    console.error('Error deleting book', error);
    throw error; 
  }
};



exports.delById = async function delById (id) {
  const query = "DELETE FROM books WHERE ID = ?;";
  const values = [id];
  const data = await db.run_query(query, values);
  return data;
};

exports.update = async function update (book) {
  const query = "UPDATE books SET ? WHERE ID = ?;";
  const values = [book, book.ID];
  const data = await db.run_query(query, values);
  return data;
};