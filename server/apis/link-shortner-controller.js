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
    let longUrl = req.body.url;
    let shortUrl = '';
    if(req.body.url && isUrl(req.body.url)){
        console.log(req.body.url);
        urlSchema.findOne({long_url: longUrl}, (err, doc) => {
            if(doc) {
                console.log(doc)
                //URL has already been shortened
                // base58 encode the unique _id of that document and construct the short URL
                shortUrl = `${req.protocol}://${req.get('host')}/${linkShortnerApi.encode(doc._id)}`;
                // since the document exists, we return it without creating a new entry
                res.json({'shortUrl': shortUrl});
            } else {
                console.log('newUrl');
                // The long URL was not found in the long_url field in our urls
                // collection, so we need to create a new entry
                 let newUrl = urlSchema({
                    long_url: longUrl,
                    short_url: '',
                    lastVisited: null
                 });

                 newUrl.save((err) => {
                    if (err){
                    return err;
                 }

                 // construct the short URL
                shortUrl = `${req.protocol}://${req.get('host')}/${linkShortnerApi.encode(newUrl._id)}`;
                
                urlSchema.findOneAndUpdate({long_url: longUrl}, {'short_url': shortUrl}, (err, counter) => {
                    if(err) return err;
                });

                res.json({'shortUrl': shortUrl});
            })
        }
    });
        
    } else {
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
    if(req.params.encoded_id){
        const id = linkShortnerApi.decode(req.params.encoded_id);
        console.log('ID', id);
        const update = { $inc: { hits: 1 }, lastVisited: moment()};
        // check if url already exists in database
        urlSchema.findOneAndUpdate({_id: id}, {update}, (err, doc) => {
           if(doc) {
                console.log('REDIRECTING')
                console.log('doc.long_url', doc.long_url);
                res.writeHead(302, {'Location': `http://localhost:9080/${doc.long_url}`});
				res.end();
           } else {
               console.log('REDIRECTING')
               res.redirect(`${req.protocol}://${req.get('host')}/`);
           }
        });
    }
};

const getHistoryLinkslist = (req, res) => {
    urlSchema.find({}, (err, docs) => {
        if(docs)
        res.json(docs)
    });
}

const deleteUrl = (req, res) => {
     const id = linkShortnerApi.decode(req.params.encoded_id)
     urlSchema.findByIdAndRemove({'_id': id}, (err, doc) => {
         urlSchema.find({}, (err, docs) => {
            if(docs)
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