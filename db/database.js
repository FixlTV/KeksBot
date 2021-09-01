const mongoose = require('mongoose')
const { dbpath } = require('../config.json')

module.exports = async function() {
    await mongoose.connect(dbpath)
    return mongoose
}