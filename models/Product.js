var mongoose = require("mongoose");

var SchemaTypes = mongoose.Schema.Types;
var ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, default: 'Stones' },
    price: { type: String, required: true },
    imageUrl: { type: String, required: true },
    gltfUrl: { type: String, required: true },
    detail: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    description: String
});

mongoose.model("Product", ProductSchema);