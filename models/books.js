const db = require('../helpers/database');

//get a single article by its id  
exports.getById = async function getById (id) {
  const query = "SELECT * FROM books WHERE ID = ?;";
  const values = [id];
  const data = await db.run_query(query, values);
  return data;
}

exports.getAll = async function getAll() {
  try {
    const query = "SELECT * FROM books;";
    const data = await db.run_query(query); // No need for values since it's fetching all
    return data;
  } catch (error) {
    console.error("Error fetching all books:", error);
    throw error; // Rethrow so the caller can handle it
  }
}

exports.add = async function add (book) {
  const query = "INSERT INTO books SET ?";
  const data = await db.run_query(query, book);
  return data;
}

exports.delById = async function delById (id) {
  const query = "DELETE FROM books WHERE ID = ?;";
  const values = [id];
  const data = await db.run_query(query, values);
  return data;
}

exports.update = async function update (book) {
  const query = "UPDATE books SET ? WHERE ID = ?;";
  const values = [book, book.ID];
  const data = await db.run_query(query, values);
  return data;
}