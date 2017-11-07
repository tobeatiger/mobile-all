var base = require('./base');

var Types = base.mongoose.Schema.Types;

var Picture = base.mongoose.model('Picture', {
    linkTo: String,  // link to which collection
    data: String   // data in base64 format
});

module.exports = Picture;