import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import query from "../db/query.js";
import postgres from "../db/postgres.js";
import "../loadEnv.js";

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = await query(req.ip, "SELECT * FROM users WHERE _id = (SELECT user_id FROM sessions WHERE user_id = $1 AND session_token = $2)", [decoded._id, token]);

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate" });
  }
};

const findByCredentials = async (email, password) => {
  const user = (await postgres.query("SELECT * FROM users WHERE email = $1", [email])).rows[0];

  if (!user) {
    throw new Error("Unable to login");
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
