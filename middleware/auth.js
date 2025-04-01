const basicAuth = require("basic-auth"); 
const usersModel = require("../models/users"); 

const auth = async (ctx, next) => {
  const credentials = basicAuth(ctx.req); 

  console.log("Received authentication request...");
  if (!credentials || !credentials.name) {
    console.error("No credentials provided!");
    ctx.status = 401;
    ctx.body = { error: "Authentication required" };
    return;
  }

  console.log("Authenticating user:", credentials.name);
  const user = await usersModel.getUserByUsername(credentials.name);
  if (!user) {
    console.error("Invalid credentials for user:", credentials.name);
    ctx.status = 401;
    ctx.body = { error: "Invalid credentials" };
    return;
  }

  console.log("User authenticated successfully:", user);
  ctx.state.user = user;
  await next();
};

module.exports = auth;
