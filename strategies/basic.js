const BasicStrategy = require('passport-http').BasicStrategy;
const users = require('../models/users');
const bcrypt = require('bcrypt');

const verifyPassword = function (user, password) {
  //console.log("Entered Password for Verification:", password);
 // console.log("Stored Hash:", user.password);
  
  return bcrypt.compareSync(password, user.password);
};

const checkUserAndPass = async (username, password, done) => {
  let result;
  try {
    result = await users.findByUsername(username);
   // console.log("Database result:", result); // 🔍 Debug: Check if user is found
  } catch (error) {
    console.error(`Error during authentication for user ${username}`);
    return done(error);
  }

  if (result.length) {
    const user = result[0];
   // console.log("Stored Hash:", user.password); // 🔍 Debug: Check stored hash
   // console.log("Entered Password:", password); 

    if (verifyPassword(user, password)) {
      console.log(`Successfully authenticated user ${username}`);
      return done(null, user);
    } else {
      console.log(`Password incorrect for user ${username}`);
    }
  } else {
    console.log(`No user found with username ${username}`);
  }
  return done(null, false);
};

const strategy = new BasicStrategy(checkUserAndPass);
module.exports = strategy;