const { Pool } = require('pg')

// eslint-disable-next-line no-undef
const connectionString = process.env.PGURI

const pool = new Pool({connectionString})

module.exports = pool