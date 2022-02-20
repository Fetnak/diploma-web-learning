import request from "supertest";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import app from "../src/app.js";
import {
  userOne,
  userTwo,
  userThree,
  sessionOne,
  sessionTwo,
  sessionThree,
  setupDatabase
} from "./fixtures/db.js";
import postgres from "./fixtures/postgres.js";
import "./fixtures/loadTestEnv.js";

beforeEach(() => {
    setupDatabase();
});

// afterEach(() => {
//     console.log('afterEach')
// })

test("Should sign up a new users of each role", async () => {
  const administrator = {
    login: "administrator",
    password: "12345678",
    name: "administrator",
    email: "administrator@example.com",
    role: "administrator"
  };
  const teacher = {
    login: "teacher",
    password: "12345678",
    name: "teacher",
    email: "teacher@example.com",
    role: "teacher"
  };
  const student = {
    login: "student",
    password: "12345678",
    name: "student",
    email: "student@example.com",
    role: "student"
  };

//   await postgres.query("INSERT INTO users (_id, _login, _password, _name, email, role) VALUES ($1, $2, $3, $4, $5, $6)", [administrator._id, administrator._login, administrator._password, administrator.name, administrator.email, administrator.role]);
//   await postgres.query("INSERT INTO users (_id, _login, _password, _name, email, role) VALUES ($1, $2, $3, $4, $5, $6)", [teacher._id, teacher._login, teacher._password, teacher.name, teacher.email, teacher.role]);
//   await postgres.query("INSERT INTO users (_id, _login, _password, _name, email, role) VALUES ($1, $2, $3, $4, $5, $6)", [student._id, student._login, student._password, student.name, student.email, student.role]);

  const responseAdministrator = await request(app).post("/users").send(administrator).expect(201);
  const responseTeacher = await request(app).post("/users").send(teacher).expect(201);
  const responseStudent = await request(app).post("/users").send(student).expect(201);

  // Asserts that database was changed correctly
  const Administrator = await postgres.query("SELECT * FROM users WHERE email = $1", [administrator.email]);
  const Teacher = await postgres.query("SELECT * FROM users WHERE email = $1", [teacher.email]);
  const Student = await postgres.query("SELECT * FROM users WHERE email = $1", [student.email]);

  // Assertions about the response
  expect(Administrator.rows[0]).toMatchObject({
    _login: "administrator",
    _name: "administrator",
    email: "administrator@example.com",
    role: "administrator"
  });
  expect(Administrator.rows[0]._password).not.toBe(administrator._password);
});

// test("Should login existing user", async () => {
//   const response = await request(app).post("/users/login").send({
//     name: userOne.name,
//     email: userOne.email,
//     password: userOne.password
//   }).expect(200);

//   // Asserts that database was changed correctly
//   const user = await User.findById(response.body.user._id);
//   expect(user).not.toBeNull();

//   // Assertions about the response
//   expect(response.body).toMatchObject({
//     user: {
//       name: userOne.name,
//       email: userOne.email.toLowerCase()
//     },
//     token: user.tokens[1].token
//   });
//   expect(user.password).not.toBe(userOne.password);
// });

// test("Should not login nonexisting user", async () => {
//   await request(app).post("/users/login").send({
//     email: "nonexisting email",
//     password: "nonexisting password"
//   }).expect(400);
// });

// test("Should get profile for user", async () => {
//   await request(app)
//     .get("/users/me")
//     .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
//     .send()
//     .expect(200);
// });

// test("Should not get profile for unauthentificated user", async () => {
//   await request(app)
//     .get("/users/me")
//     .send()
//     .expect(401);
// });

// test("Should delete account for user", async () => {
//   const response = await request(app)
//     .delete("/users/me")
//     .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
//     .send()
//     .expect(200);

//   const user = await User.findById(userOneId);
//   expect(user).toBeNull();
// });

// test("Should not delete account for unauthentificated user", async () => {
//   await request(app)
//     .delete("/users/me")
//     .send()
//     .expect(401);
// });

// test("Should upload avatar image", async () => {
//   await request(app)
//     .post("/users/me/avatar")
//     .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
//     .attach("avatar", "tests/fixtures/avatar-example.png")
//     .expect(200);
//   const user = await User.findById(userOneId);
//   expect(user.avatar).toEqual(expect.any(Buffer));
// });

// test("Should update valid user fields", async () => {
//   await request(app)
//     .patch("/users/me")
//     .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
//     .send({
//       name: "Fetnak3",
//       email: "Fetnak3@example.com",
//       password: "123sda8"
//     })
//     .expect(200);

//   const user = await User.findById(userOneId);

//   expect(user.name).toEqual("Fetnak3");
//   expect(user.email).toEqual("Fetnak3@example.com".toLowerCase());
//   expect(user.password).not.toBe(bcrypt.hash(userOne.password, 8));
// });

// test("Should not update invalid user fields", async () => {
//   await request(app)
//     .patch("/users/me")
//     .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
//     .send({
//       location: "Belarus"
//     })
//     .expect(400);
// });
