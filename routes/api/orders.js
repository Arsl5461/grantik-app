var router = require('express').Router();
var mongoose = require('mongoose');
var axios = require('axios');
var auth = require('../auth');
var Order = mongoose.model('Order');

router.get("/", function(req, res, next) {
    Order.find().then(function(orders) {
        return res.json(orders)
    }).catch(next);
})

router.post("/", async function(req, res, next) {
    console.log(req.body);
    await Order.create(req.body);
})

router.get("/:orderId", function(req, res, next) {
    const orderId = req.params.orderId;
    Order.findOne({ _id: orderId }).then(function(order) {
        return res.json(order);
    }).catch(next);
})

router.delete("/:orderId", auth.required, function(req, res, next) {
    const orderId = req.params.orderId;
    Order.findByIdAndRemove(orderId, {}).then(function() {
        return res.json("delete success")
    }).catch(next);
})

router.patch("/:orderId", auth.required, function(req, res, next) {
    const orderId = req.params.orderId;
    Order.findByIdAndUpdate(orderId, {delivered: true}).then(function(order) {
        return res.json("Update success")
    }).catch(next);
})

module.exports = router;