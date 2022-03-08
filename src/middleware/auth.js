import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import query from "../db/query.js";
import postgres from "../db/postgres.js";
import "../loadEnv.js";

const auth = async (req, res, next) => {
  if (req.body.authData.isAuth) {
    next();
  } else {
    res.status(401).end();
  }
};

const findByCredentials = async (email, password) => {
  const user = (await postgres.query("SELECT * FROM users WHERE email = $1", [email])).rows[0];

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(password, user._password);

  if (!isMatch) {
    throw new Error("Password is incorrect");
  }

  return user;
};

const generateAuthToken = async (user) => {
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_KEY);

  await postgres.query("INSERT INTO sessions(session_token, user_id) VALUES ($1, $2)", [token, user._id]);

  return token;
};

export default {
  auth,
  findByCredentials,
  generateAuthToken
};