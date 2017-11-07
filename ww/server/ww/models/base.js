var bcrypt = require('bcrypt-nodejs');
var cryptPassword = function (password, cb) {
    bcrypt.hash(password, null, null, function (err, hash) {
        if(err) {
            return cb(err);
        }
        return cb(err, hash);
    });
};
var comparePassword = function (password, userPassword, cb) {
    bcrypt.compare(password, userPassword, function (err, res) {
        if(err) {
            return cb(err);
        }
        return cb(null, res);
    });
};

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/ww-db', {
    server: {
        socketOptions: {
            socketTimeoutMS: 0,
            connectionTimeout: 0,
            connectTimeoutMS: 0
        }
    }
}); // todo: host to be configurable
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Mongo connected!');
    //var jim = new UserDocuments({
    //    userName: 'Jim YI',
    //    userId: '43425307',
    //    email: 'tobeatiger@126.com',
    //    userPassword: '$2a$10$Z5/GkIDTq8MrwXSJDCZUWevejHCRly4SsMDYdgdTfLWYkNq5j3bfK',
    //    photoURL: ''
    //});
    //jim.save(function (err) {
    //    if(err) {
    //        console.log(err);
    //    } else {
    //        console.log('saved!');
    //    }
    //});
    //var borry = new UserDocuments({
    //    userName: 'Borry Huang',
    //    userId: '43310547',
    //    userPassword: '$2a$10$Z5/GkIDTq8MrwXSJDCZUWevejHCRly4SsMDYdgdTfLWYkNq5j3bfK',
    //    photoURL: ''
    //});
    //borry.save(function (err) {
    //    if(err) {
    //        console.log(err);
    //    } else {
    //        console.log('saved!');
    //    }
    //});
});

module.exports = {
    mongoose: mongoose,
    db: db,
    encryptCode: cryptPassword,
    compareCode: comparePassword
};