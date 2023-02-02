var mongoose = require('mongoose');
const { ObjectId } = require('mongoose/lib/schema');

var OrderSchema = new mongoose.Schema({
    orderId: String,
    paymentType: String,
    products: Array,
    amount: Number,
    address: String,
    email: String,
    contactName: String,
    contactSurename: String,
    country: String,
    phone: String,
    regionNumber: String,
    created_at: { type: Date, default: Date.now },
    deliveried: { type: Boolean, default: false },
}, { timestamps: true });

mongoose.model('Order', OrderSchema); ``