var base = require('./base');

var UserPhoto = base.mongoose.model('UserPhoto', {
    userId: String,
    data: String,
    active: {type: Boolean, default: true}
});

module.exports = UserPhoto;