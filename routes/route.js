/**
 * Created by sanu on 16/3/18.
 */
let express = require('express');
let router = express.Router();
let jwt = require('jsonwebtoken');
let User = require('../models/userSchema');
let validator = require('validator');
let isBase64 = require('is-base64');

let config = require('../config');

//Authentication
router.use(function (req, res, next) {
    let token = req.body.token || req.query.token || req.headers.authorization;
    if (token) {
        jwt.verify(token, config.jwt_token, function (err, decoded) {
            if (err) {
                console.log(err);
                return res.status(403).json({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
            } else {
                req.email = decoded.email;
                req.userId = decoded.userId;
                next();
            }
        });

    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});

router.editUser = function (req, res, next) {
    var valid = validator.isAlpha(req.body.name.firstName);
    if (req.body.name.middleName) {
        valid = valid && validator.isAlpha(req.body.name.middleName);
    }
    if (req.body.name.lastName) {
        valid = valid && validator.isAlpha(req.body.name.lastName);
    }
    if (req.body.email) {
        valid = valid && validator.isEmail(req.body.email);
    }

    if(!isBase64(req.body.imageBase64)){
        valid = false;
    }

    if (valid == 0) {
        res.status(210).json({
            "info": "Invalid data"
        });
    } else {
        User.findById(req.userId, function (userFetchError, userObj) {
            if (userFetchError) {
                res.status(500).json({
                    message: "User Fetch Error",
                    error: userFetchError
                });
            } else if (!userObj) {
                res.status(404).json({
                    info: 'User Not Found'
                });
            }
            else {
                if(req.body.name.firstName)
                    userObj.name.firstName = req.body.name.firstName;
                if(req.body.name.middleName)
                    userObj.name.middleName = req.body.name.middleName;
                if(req.body.name.lastName)
                    userObj.name.lastName = req.body.name.lastName;
                if(req.body.imageBase64)
                    userObj.imageBase64 = req.body.imageBase64;
                userObj.save(function (userSaveError, updatedUser) {
                    if (userSaveError) {
                        res.status(500).json(userSaveError);
                    } else {
                        res.status(200).json({
                            "id": updatedUser._id
                        });
                    }
                });
            }

        })
    }

};

