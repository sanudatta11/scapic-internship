/**
 * Created by sanu on 16/3/18.
 */
let express = require('express');
let router = express.Router();
let validator = require('validator');
let isBase64 = require('is-base64');

let User = require('../models/userSchema');

router.validateUser = function (req, callback) {
    if (
        'firstName' in req.body &&
        'lastName' in req.body &&
        'email' in req.body &&
        'imageBase64' in req.body &&
        'password' in req.body &&
        req.body.imageBase64 != '' &&
        validator.isAlpha(req.body.firstName) &&
        validator.isAlpha(req.body.lastName) &&
        validator.isEmail(req.body.email) &&
        isBase64(req.body.imageBase64)
    )
        callback(true);
    else
        callback(false);
};

router.validateNewAccount = function (req, callback) {
    User.findOne({
        email: req.body.email
    }, function (err, data) {
        if (err)
            callback(err);
        else
            callback(null, data);
    })
};

module.exports = router;