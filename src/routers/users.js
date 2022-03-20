import Router from "express-promise-router";
import bcrypt from "bcryptjs";
import validator from "validator";
import query from "../db/query.js";
import auth from "../middleware/auth.js";

const router = new Router();

// Create new user
router.post("/api/v1/signup", async (req, res) => query(
  req.ip,
  "SELECT * FROM secret_keys WHERE _key=$1",
  [req.body.secret_key]
)
  .then(async (resp) => {
    if (resp.rowCount !== 0) {
      if (!validator.isEmail(req.body.email)) {
        return res.status(400).send({ error: "invalid email!" });
      }
      if (req.body.password.length < 8) {
        return res.status(400).send({ error: "Password is too short!" });
      }

      const checkedValues = {
        login: req.body.login,
        password: await bcrypt.hash(req.body.password, 8),
        name: req.body.name,
        email: req.body.email,
        group_id: req.body.group_id,
        role: req.body.role
      };

      return query(
        req.ip,
        "INSERT INTO users (_login, _password, _name, email, group_id, role) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          checkedValues.login,
          checkedValues.password,
          checkedValues.name,
          checkedValues.email,
          checkedValues.group_id,
          checkedValues.role
        ]
      )
        .then(() => res.status(201).send())
        .catch(() => res.status(400).send());
    }
    return res.status(400).send({ error: "invalid secret key!" });
  })
  .catch(() => res.status(400).send({ error: "Unknown error!" })));

// Create new user as admin
router.post("/api/v1/user", auth.administrator, async (req, res) => {
  console.log(req.body);
  console.log("111111");
  if (!validator.isEmail(req.body.email)) {
    return res.status(400).send({ error: "invalid email!" });
  }
  console.log("111222");
  if (req.body.password.length < 8) {
    return res.status(400).send({ error: "Password is too short!" });
  }
  console.log("222222");
  const checkedValues = {
    login: req.body.login,
    password: await bcrypt.hash(req.body.password, 8),
    name: req.body.name,
    email: req.body.email,
    group_id: req.body.group_id,
    role: req.body.role
  };

  console.log("333333");
  return query(
    req.ip,
    "INSERT INTO users (_login, _password, _name, email, group_id, role) VALUES ($1, $2, $3, $4, $5, $6)",
    [
      checkedValues.login,
      checkedValues.password,
      checkedValues.name,
      checkedValues.email,
      checkedValues.group_id,
      checkedValues.role
    ]
  )
    .then(() => res.status(201).send())
    .catch(() => res.status(400).send());
});

// Log in exited user
router.post("/api/v1/auth", async (req, res) => {
  try {
    const user = await auth.findByCredentials(
      req.body.login,
      req.body.password
    );
    req.session.userId = user._id;
    req.session.role = user.role;
    req.session.isAuth = true;
    return res.status(200).send({ name: user.name });
  } catch (error) {
    return res.status(401).send();
  }
});

// Auth check
router.get("/api/v1/auth/check", async (req, res) => {
  res.status(200).send({ authorized: req.session.isAuth });
});

// Logout user
router.get("/api/v1/auth/logout", auth.student, async (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      return next(error);
    }
    return res.status(204).end();
  });
});

// Read user
router.get("/api/v1/user", auth.student, async (req, res) => query(req.ip, "SELECT _login, _name, email, group_id FROM users WHERE _id = $1", [req.session.userId])
  .then((resp) => res.status(200).send(resp.rows[0]))
  .catch((e) => res.status(400).send(e)));

// Read users
router.get("/api/v1/users", auth.administrator, async (req, res) => query(req.ip, "SELECT users._id, users._login, users._name, users.email, users.group_id, users.role, groups._name AS group FROM users JOIN groups ON users.group_id = groups._id")
  .then((resp) => res.status(200).send(resp.rows))
  .catch(() => res.status(400).send()));

// Delete user
router.post("/api/v1/user/delete", auth.administrator, async (req, res) => query(req.ip, "DELETE FROM users WHERE _id = $1", [req.body.id])
  .then(() => res.status(200).send())
  .catch(() => res.status(400).send()));

// Delete current user
router.delete("/api/v1/user/delete", auth.student, async (req, res) => {
  query(req.ip, "DELETE FROM users WHERE _id = $1", [req.user.rows[0]._id])
    .then(() => res.status(200).send())
    .catch((e) => res.status(500).send(e));
});

// Update user
router.patch("/api/v1/user", auth.administrator, async (req, res) => {
  const checkedValues = {
    password: await bcrypt.hash(req.body.password, 8),
    name: req.body.name,
    email: req.body.email,
    group_id: req.body.group_id,
    role: req.body.role
  };

  if (req.body.password) {
    checkedValues.password = await bcrypt.hash(req.body.password, 8);
  }
  if (req.body.name) {
    checkedValues.name = req.body.name;
  }
  if (req.body.email) {
    checkedValues.email = req.body.email;
  }

  return query(
    req.ip,
    "UPDATE users SET (_password, _name, email) = ($1, $2, $3) WHERE _id = $4",
    [
      checkedValues.password,
      checkedValues.name,
      checkedValues.email,
      req.user.rows[0]._id
    ]
  )
    .then((resp) => res.status(200).send(resp))
    .catch((e) => res.status(500).send(e));
});

export default router;
