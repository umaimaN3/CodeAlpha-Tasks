const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

customerName: String,

items: [
{
productId: String,
name: String,
price: Number
}
],

totalPrice: Number,

createdAt: {
type: Date,
default: Date.now
}

});

module.exports = mongoose.model("Order", orderSchema);