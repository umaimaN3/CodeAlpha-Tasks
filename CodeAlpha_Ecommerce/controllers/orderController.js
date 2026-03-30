const Order = require("../models/Order");

exports.createOrder = async (req, res) => {

try {

const order = await Order.create(req.body);

res.json(order);

} catch (error) {

res.status(500).json({message:"Error creating order"});

}

};