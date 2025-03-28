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
    const query = "SELECT * FROM books WHERE userID = ?;";
    const data = await db.run_query(query, [userID]);
    return data;
  } catch (error) {
    console.error("Error fetching user's books:", error);
    throw error;
  }
};



exports.add = async function add(book) {
  const query = "INSERT INTO books (title, author, userID) VALUES (?, ?, ?)";
  const values = [book.title, book.author, book.userID];
  const data = await db.run_query(query, values);
  return data;
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