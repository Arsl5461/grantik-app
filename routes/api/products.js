var router = require('express').Router();
var mongoose = require('mongoose');
var auth = require('../auth');
var Product = mongoose.model('Product');

router.get("/", function(req, res, next) {
    Product.find().then(function(products) {
        return res.json(products)
    }).catch(next);
})

router.get("/:productId", function(req, res, next) {
    const productId = req.params.productId;
    Product.findOne({ _id: productId }).then(function(product) {
        return res.json(product);
    }).catch(next);
})

router.patch("/:productId", auth.required, function(req, res, next) {
    const productId = req.params.productId;
    req.body.imageUrl = req.body.image;
    req.body.gltfUrl = req.body.gltf;
    Product.findByIdAndUpdate(productId, req.body).then(function(product) {
        return res.json("Update success")
    }).catch(next);
})

router.delete("/:productId", auth.required, function(req, res, next) {
    const productId = req.params.productId;
    Product.findByIdAndRemove(productId, {}).then(function() {
        return res.json("delete success")
    }).catch(next);
})

router.post("/", auth.required, function(req, res, next) {
    const product = new Product();

    product.name = req.body.name;
    product.type = req.body.type;
    product.imageUrl = req.body.image;
    product.gltfUrl = req.body.gltf;
    product.price = req.body.price;
    product.detail = req.body.detail;
    product.description = req.body.description;
    product.save().then(() => {
        return res.json("success");
    }).catch(next);
})

module.exports = router;