/**
 * Created by sanu on 16/3/18.
 */
let express = require('express');
let router = express.Router();
let async = require('async');
let mongoose = require('mongoose');

let User = require('../models/userSchema');

let Assets = require('./assets');
let sha1 = require('sha1');

router.createUser = function (req, res) {
    async.waterfall([
        function (callback) {
            Assets.validateUser(req, function (error, valid) {
                if (valid == true) {
                    callback(null);
                } else {
                    res.status(410).json({
                        "info": "Invalid data"
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
        }
        ,
        function (callback) {
            const user = new User({
                name: {
                    firstName: req.body.firstName,
                    middleName: req.body.middleName,
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