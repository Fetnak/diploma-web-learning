import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import query from "../db/query.js";
import postgres from "../db/postgres.js";
import "../loadEnv.js";

const auth = async (req, res, next) => {
  try {
    if (req.session.isAuth) {
      next();
    } else {
      res.status(401).end();
    }
  } catch (error) {
    res.status(401).end();
  }
};

const findByCredentials = async (login, password) => {
  const user = (await postgres.query("SELECT * FROM users WHERE _login = $1", [login])).rows[0];
  console.log("asdasda"+login+password)
  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(password, user._password);

  if (!isMatch) {
    throw new Error("Password is incorrect");
  }

  return user;
};

export default {
  auth,
  findByCredentials
};