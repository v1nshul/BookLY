const bcrypt = require("bcrypt");

const password = "pass123";
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error(err);
  } else {
    console.log("Manually Hashed Password:", hash);
  }
});