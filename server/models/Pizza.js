const mongoose = require('mongoose');

const PizzaSchema =  mongoose.Schema({
    firstname: String,
    lastname: String,
    phonenumber: String,
    postalcode: Number,
    crust: String,
    size: String,
    registerDate: { type:Date, default:Date.now }
});

const Pizza = mongoose.model('Pizza', PizzaSchema);

module.exports = { Pizza }
