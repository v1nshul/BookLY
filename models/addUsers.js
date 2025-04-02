const bcrypt = require("bcrypt");
const db = require("../helpers/database"); 

async function addUser(username, email, password) {
  try {
    const hashedPassword = bcrypt.hashSync(password, 10); 
    const user = { username, email, password: hashedPassword };
    
    const query = "INSERT INTO users SET ?";
    await db.run_query(query, user);
    
    console.log(`User '${username}' added successfully!`);
  } catch (error) {
    console.error(" Error adding user:", error.message);
  }
}


async function addDummyUsers() {
  await addUser("john_doe", "john@example.com", "password123");
  await addUser("jane_doe", "jane@example.com", "securepass456");
}

addDummyUsers();
