const mongoose = require('mongoose');
const { Schema } = mongoose;

const bidSchema = new Schema({
    studentName: { type: String, required: true },
    price: { type: Number, required: true }
});

const itemSchema = new Schema({
    itemName: { type: String, required: true },
    bids: [bidSchema] // Array of bids
}, { versionKey: false });

const ItemModel = mongoose.model('Item', itemSchema);

module.exports = ItemModel;
