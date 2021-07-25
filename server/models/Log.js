const mongoose = require('mongoose');

const LogSchema =  mongoose.Schema({
    name: String,
    phoneNumber: String,
    email: String,
    rooms: Number,

    registerDate: { type:Date, default:Date.now }
});

const Log = mongoose.model('Log', LogSchema);

module.exports = { Log }
