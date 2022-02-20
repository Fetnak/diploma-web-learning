import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import postgres from "../../src/db/postgres";

const userOne = {
  _id: uuidv4(),
  _login: "userOne",
  _password: "12345678",
  _name: "userOne",
  email: "userOne@example.com",
  role: "administrator"
};

const userTwo = {
  _id: uuidv4(),
  _login: "userTwo",
  _password: "12345678",
  _name: "userTwo",
  email: "userTwo@example.com",
  role: "teacher"
};

const userThree = {
  _id: uuidv4(),
  _login: "userThree",
  _password: "12345678",
  _name: "userThree",
  email: "userThree@example.com",
  role: "student"
};

const sessionOne = {
  _id: uuidv4(),
  session_token: jwt.sign({ _id: userOne._id }, process.env.JWT_KEY),
  user_id: userOne._id
};

const sessionTwo = {
  _id: uuidv4(),
  session_token: jwt.sign({ _id: userTwo._id }, process.env.JWT_KEY),
  user_id: userTwo._id
};

const sessionThree = {
  _id: uuidv4(),
  session_token: jwt.sign({ _id: userThree._id }, process.env.JWT_KEY),
  user_id: userThree._id
};

const setupDatabase = async () => {
  await postgres.query("DELETE FROM users");
  await postgres.query("INSERT INTO users (_id, _login, _password, _name, email, role) VALUES ($1, $2, $3, $4, $5, $6)", [userOne._id, userOne._login, userOne._password, userOne.name, userOne.email, userOne.role]);
  await postgres.query("INSERT INTO users (_id, _login, _password, _name, email, role) VALUES ($1, $2, $3, $4, $5, $6)", [userTwo._id, userTwo._login, userTwo._password, userTwo.name, userTwo.email, userTwo.role]);
  await postgres.query("INSERT INTO users (_id, _login, _password, _name, email, role) VALUES ($1, $2, $3, $4, $5, $6)", [userThree._id, userThree._login, userThree._password, userThree.name, userThree.email, userThree.role]);
  await postgres.query("INSERT INTO sessions (_id, session_token, user_id) VALUES ($1, $2, $3)", [sessionOne._id, sessionOne.session_token, sessionOne.user_id]);
  await postgres.query("INSERT INTO sessions (_id, session_token, user_id) VALUES ($1, $2, $3)", [sessionTwo._id, sessionTwo.session_token, sessionTwo.user_id]);
  await postgres.query("INSERT INTO sessions (_id, session_token, user_id) VALUES ($1, $2, $3)", [sessionThree._id, sessionThree.session_token, sessionThree.user_id]);
};

export default {
  userOne,
  userTwo,
  userThree,
  sessionOne,
  sessionTwo,
  sessionThree,
  setupDatabase
};
