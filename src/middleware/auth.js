import bcrypt from "bcryptjs";
import postgres from "../db/postgres.js";
import "../loadEnv.js";

const student = async (req, res, next) => {
  try {
    if (req.session.isAuth && (req.session.role === "student" || req.session.role === "teacher" || req.session.role === "administrator")) {
      next();
    } else {
      res.status(401).end();
    }
  } catch (error) {
    res.status(401).end();
  }
};

const teacher = async (req, res, next) => {
  try {
    if (req.session.isAuth && (req.session.role === "administrator" || req.session.role === "teacher")) {
      next();
    } else {
      res.status(401).end();
    }
  } catch (error) {
    res.status(401).end();
  }
};

const administrator = async (req, res, next) => {
  try {
    if (req.session.isAuth && req.session.role === "administrator") {
      next();
    } else {
      res.status(401).end();
    }
  } catch (error) {
    res.status(401).end();
  }
};

const findByCredentials = async (login, password) => {
  const user = (
    await postgres.query("SELECT * FROM users WHERE _login = $1", [login])
  ).rows[0];
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
  administrator,
  teacher,
  student,
  findByCredentials
};
