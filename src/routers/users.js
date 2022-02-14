const express = require('express')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const router = new express.Router()
const postgres = require('../db/postgres')

// Create new user
router.post('/users', async (req, res) => {
    const values = Object.keys(req.body)
    const allowedValues = ['login', 'password', 'name', 'email', 'role']
    const isValidOperation = values.every((update) => allowedValues.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'invalid values!'})
    }
    if (!validator.isEmail(req.body.email)) {
        return res.status(400).send({ error: 'invalid email!'})
    }
    if (req.body.password.length < 8) {
        return res.status(400).send({ error: 'Password is too short!'})
    }

    const checkedValues = {
        login: req.body.login,
        password: await bcrypt.hash(req.body.password, 8),
        name: req.body.login,
        email: req.body.email,
        role: req.body.role
    }

    postgres
        .query(`INSERT INTO users (_login, _password, _name, email, role) VALUES ('${checkedValues.login}', '${checkedValues.password}', '${checkedValues.name}', '${checkedValues.email}', '${checkedValues.role}')`)
        .then(resp => res.status(201).send(resp))
        .catch(e => res.status(400).send(e))
})

// Read user
router.get('/users', async (req, res) => {
    const values = Object.keys(req.body)
    const allowedValues = ['id']
    const isValidOperation = values.every((update) => allowedValues.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'invalid values!'})
    }

    postgres
        .query(`SELECT * FROM users WHERE _id = '${req.body.id}'`)
        .then(resp => res.status(201).send(resp.rows[0]))
        .catch(e => res.status(400).send(e))
})

module.exports = router