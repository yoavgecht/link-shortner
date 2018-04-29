const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CounterSchema = require('./counter-model');
//db.countersmodels.insert({ _id: 'url_count', seq: 10000000 })
const urlSchema = new Schema({
    _id: { type: Number, index: true },
    long_url: String,
    short_url: String,
    hits: { type: Number, default: 0 },
    created_at: Date,
    lastVisited: String
}, {
    collection: 'linkmodels'
});


// The pre('save', callback) middleware executes the callback function
// every time before an entry is saved to the urls collection.
urlSchema.pre('save', function(next){
    console.log('presave');
    CounterSchema.findOne({seq: {$exists: true}}, (err, doc) => {
        console.log('findOne');
        if(err) return err;
        if(!doc){
        CounterSchema.create({ _id: 'url_count'}, {new: true, upsert: true}, (err, counter) => {
            if(err) return err;
            console.log(counter);
        });
    } else {
        console.log("EXISTS");
        const doc = this;
        // find the url_count and increment it by 1
        CounterSchema.findByIdAndUpdate({_id: 'url_count'}, {$inc:{seq: 100}}, (err, counter) => {
            console.log('findByIdAndUpdate');
            if(err) return next(err);
            doc._id = counter.seq;
            console.log(doc._id);
            doc.created_at = new Date();
            next();
            });
        }
    });
});




module.exports = mongoose.model('LinkModel', urlSchema);