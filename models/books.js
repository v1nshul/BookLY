const db = require('../helpers/database');

/**
 * Get a book by its ID
 * @param {number} id - The ID of the book
 * @returns {Promise<Array>} - Array containing the book object
 */

exports.getById = async function getById (id) {
  const query = "SELECT * FROM books WHERE ID = ?;";
  const values = [id];
  const data = await db.run_query(query, values);
  return data;
};

/**
 * Get all books associated with a user
 * @param {number} userID - The ID of the user
 * @returns {Promise<Array>} - Array of books
 */
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

/**
 * Search for books by title or author
 * @param {string} query - The search query
 * @returns {Promise<Array>} - Array of matching books
 */
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

/**
 * Get a book from a user's list by title
 * @param {number} userID - The ID of the user
 * @param {string} title - The title of the book
 * @returns {Promise<Array>} - Array containing the book object (empty if no match)
 */
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


/**
 * Add a new book to the database
 * @param {Object} book - The book object
 * @param {string} book.title - The title of the book
 * @param {string} book.author - The author of the book
 * @param {number} book.userID - The ID of the user adding the book
 * @returns {Promise<Object>} - Object with message and bookID
 * @throws {Error} - If database operation fails
 */

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

/**
 * Remove a book from a user's list
 * @param {string} title - The title of the book
 * @param {string} author - The author of the book
 * @param {number} userID - The ID of the user
 * @returns {Promise<Object>} - Object with a message indicating success or failure
 */
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

/**
 * Delete a book from the database by its ID
 * @param {number} id - The ID of the book to delete
 * @returns {Promise<Object>} - Database response
 */
exports.delById = async function delById (id) {
  const query = "DELETE FROM books WHERE ID = ?;";
  const values = [id];
  const data = await db.run_query(query, values);
  return data;
};

/**
 * Update book details in the database
 * @param {Object} book - The book object with updated fields
 * @param {number} book.ID - The ID of the book to update
 * @returns {Promise<Object>} - Database response
 */
exports.update = async function update (book) {
  const query = "UPDATE books SET ? WHERE ID = ?;";
  const values = [book, book.ID];
  const data = await db.run_query(query, values);
  return data;
};