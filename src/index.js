/* eslint-disable no-undef */
if (process.env.NODE_ENV !== 'production') {
    const path = require('path')
    require('dotenv').config({ path: path.join(__dirname, '../config/dev.env'), debug: true });
}

const app = require('./app')
const port = process.env.PORT

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})