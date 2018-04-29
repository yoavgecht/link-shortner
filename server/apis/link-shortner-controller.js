const urlSchema = require('../models/link-model');
const isUrl = require('../../node_modules/validator/lib/isURL');
const linkShortnerApi = require('./link-shortner-api');
const moment = require("moment");

/**
 * Saves the link to the database and returns a shortened one
 *
 * @param req URL to save and shorten
 * @param res Shortened URL and other resource information
 */
const saveUrl = (req, res) => {
    console.log('saveUrl', req.body.url);
    let longUrl = req.body.url;
    let shortUrl = '';
    if(req.body.url && isUrl(req.body.url)){
        console.log('ITS URL');
        urlSchema.findOne({long_url: longUrl}, (err, doc) => {
            if(doc) {
                console.log('Already shortened');
                //URL has already been shortened
                // base58 encode the unique _id of that document and construct the short URL
                shortUrl = `${req.protocol}://${req.get('host')}/${linkShortnerApi.encode(doc._id)}`;
                // since the document exists, we return it without creating a new entry
                res.send({'shortUrl': shortUrl});

            } else {
                // The long URL was not found in the long_url field in our urls
                // collection, so we need to create a new entry
                 let newUrl = urlSchema({
                    long_url: longUrl,
                    short_url: '',
                    lastVisited: 'No yet visited'
                 });

                 newUrl.save((err) => {
                    if (err){
                    console.log(err);
                 }

                 // construct the short URL
                shortUrl = `${req.protocol}://${req.get('host')}/${linkShortnerApi.encode(newUrl._id)}`;

                urlSchema.findOneAndUpdate({long_url: longUrl}, {'short_url': shortUrl}, (err, counter) => {
                    if(err) return err;
                    console.log('COUNTER', counter);
                });

                res.send({'shortUrl': shortUrl});
            })
        }
    });
        
    } else {
        console.log('ERROR!', 'Bad request: url is undefined or not formatted properly');
        res.status(400).json({ message: 'Bad request: url is undefined or not formatted properly'});
    }
};

/**
 * Takes the code, decodes it, and searches
 * the database for the record to redirect user
 *
 * @param req link code as request parameter
 * @param res URL
 */
const getUrl = (req, res) => {
    console.log('req.params.encoded_id', req.params.encoded_id);
    if(req.params.encoded_id){
        console.log('req.params.encoded_id', 'OK')
        const id = linkShortnerApi.decode(req.params.encoded_id);
        const update = { $inc: { hits: 1 } };
        console.log('ID', id)
        // check if url already exists in database
        urlSchema.findByIdAndUpdate({_id: id}, update, {lastVisited: moment()}, (err, doc) => {
            console.log('DOC', doc)
           if(doc) {
               console.log('DOC FOUND!')
               console.log('doc.long_url', doc.long_url);
            
                
                res.header("Access-Control-Allow-Origin", "*");
                res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
                res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, Authorization");
                res.header('Access-Control-Allow-Headers', 'Content-Type');
                res.status(302).redirect(doc.long_url);
				res.end();
           } else {
               console.log('DOC NOT FOUND!')
               res.redirect(`${req.protocol}://${req.get('host')}/`);
           }
        });
    }
};

const getHistoryLinkslist = (req, res) => {
    urlSchema.find({}, (err, docs) => {
        if(docs)
        console.log(docs);
        res.json(docs)
    });
}

const deleteUrl = (req, res) => {
     console.log("req.params.id", req.params.encoded_id);
     const id = linkShortnerApi.decode(req.params.encoded_id)
     console.log('ID', id);
     urlSchema.findByIdAndRemove({'_id': id}, (err, doc) => {
         urlSchema.find({}, (err, docs) => {
            if(docs)
            console.log(docs);
            res.json(docs)
        });
     });
}

module.exports = {
    saveUrl,
    getUrl,
    getHistoryLinkslist,
    deleteUrl
};