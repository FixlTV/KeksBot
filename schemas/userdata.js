const mongoose = require('mongoose')

const reqNum = {
    type: Number,
    required: true
}

var userdataSchema = mongoose.Schema({
    _id: { type: String, required: true },
    xp: Number,
    lv: Number,
    cookies: Number,
    giftdm: Number,
    thismin: Number,
    badges: {
        partner: Boolean,
        verified: Boolean,
        team: Boolean,
        dev: Boolean,
        mod: Boolean,
        beta: Boolean
    }
})

module.exports = mongoose.model('userdata', userdataSchema)