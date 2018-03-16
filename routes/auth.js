/**
 * Created by sanu on 16/3/18.
 */
/*jslint es6 */
"use strict"
let express = require('express');
let router = express.Router();
let jwt = require('jsonwebtoken');
let async = require('async');
let validator = require("email-validator");
let mongoose = require('mongoose');

let auth = require('./auth');
let config = require('../config');

let User = require('../models/userSchema');


let Assets = require('./assets');
let sha1 = require('sha1');

router.login = (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;
    if (email && password && validator.validate(email)) {
        async.waterfall([
            function (callback) {
                User.findOne({
                    "email": email,
                }, function (err, data) {
                    if (err)
                        res.status(500).json({
                            message: "Email Query Error",
                            error: err
                        });

                    else if (!data)
                        res.status(401).json({
                            message: "No Data Found on Email"
                        });
                    else {
                        callback(null, data);
                    }
                });
            },
            function (data, callback) {
                if(data.password == sha1(password))
                {
                    let token = jwt.sign({
                        email: email,
                        userId: data._id
                    }, config.jwt_token, {
                        expiresIn: 150000000
                    });

                    res.status(200).json({
                        "access_token": token
                    });

                    callback(null);
                }
                else{
                    res.status(401).json({
                        message : "Invalid Password"
                    })
                }
            }
        ], function (err, result) {
            console.log('Done Callback --> ' + result);
            if(err)
                res.status(500).json({
                    error: err
                })
        });

    } else {
        res.status(403).json({
            "message": "Invalid Data"
        })
    }
};

router.createUser = (req, res,next) => {
    async.waterfall([
        function (callback) {
            Assets.validateUser(req, function (valid) {
                if (valid == true) {
                    callback(null);
                } else {
                    res.status(410).json({
                        "info": "Incomplete or Invalid data"
                    });
                }
            });
        },
        function (callback) {
            Assets.validateNewAccount(req,function (err,data) {
                if(err)
                    res.status(500).json({
                        message: "User Previous account verification Error",
                        error: err
                    });
                else if(!data)
                    callback(null);
                else
                    res.status(409).json({
                        message: "Conflict of pre-existing Email for an account"
                    });
            })
        },
        function (callback) {
            const user = new User({
                name: {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                },
                email:  req.body.email,
                imageBase64: req.body.imageBase64,
                password: sha1(req.body.password)
            });
            user.save(function(err, savedUser) {
                if (err) {
                    res.status(500).json({
                        message: "Error Saving user",
                        error: err
                    });
                } else {
                    callback(null,savedUser);
                }
            });
        }
    ], function (err, savedUser) {
        if (err) {
            res.status(500).json({
                message: "User Create Error",
                error : err
            });
        } else {
            res.status(200).json(savedUser);
        }
    });
};

module.exports = router;