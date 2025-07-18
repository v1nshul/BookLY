const db = require('../helpers/database');
const bcrypt = require('bcrypt');

//get a single user by its id  
exports.getById = async function getById (id) {
  const query = "SELECT * FROM users WHERE ID = ?;";
  const values = [id];
  const data = await db.run_query(query, values);
  return data;
}

exports.getUserByUsername = async function getUserByUsername(username) {
  try {
    const query = "SELECT * FROM users WHERE username = ? LIMIT 1";
    const values = [username];
    const data = await db.run_query(query, values);
    return data.length > 0 ? data[0] : null; // Return user or null
  } catch (error) {
    console.error("Error fetching user by username:", error);
    throw error;
  }
};

//get a single user by the (unique) username
exports.findByUsername = async function getByUsername(username) {
  const query = "SELECT * FROM users WHERE username = ?;";

  const user = await db.run_query(query, [username]);

  return user;
};

//list all the users in the database
exports.getAll = async function getAll (page, limit, order) {
  const query = "SELECT * FROM users;";
  const data = await db.run_query(query);
  return data;
}

//create a new user in the database
exports.add = async function add (user) {
  const query = "INSERT INTO users SET ?";
  if (!user.password.startsWith("$2b$")) {  // Check if already hashed
    user.password = bcrypt.hashSync(user.password, 10);
  }
  const data = await db.run_query(query, user);
  return data;
}

//delete a user by its id
exports.delById = async function delById (id) {
  const query = "DELETE FROM users WHERE ID = ?;";
  const values = [id];
  const data = await db.run_query(query, values);
  return data;
}

//update an existing user
exports.update = async function update (user) {
  const query = "UPDATE users SET ? WHERE ID = ?;";
  if (user.password) {
    const password = user.password;
    const hash = bcrypt.hashSync(password, 10);
    user.password = hash;  
  }
  const values = [user, user.ID];
  const data = await db.run_query(query, values);
  return data;
}