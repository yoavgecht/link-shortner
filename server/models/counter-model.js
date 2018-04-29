const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CounterSchema = new Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 1000000000 }
}, {
    timestamps: true,
    collection: 'countersmodels'
})

module.exports = mongoose.model('CounterModel', CounterSchema);