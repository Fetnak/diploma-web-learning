const express = require('express')
const postgres = require('./db/postgres')
const usersRouter = require('./routers/users')

const app = express()

app.use(express.json())
app.use(usersRouter)

postgres.query('SELECT NOW()', (err, res) => {
    console.log(err, res.rows)
})

module.exports = app