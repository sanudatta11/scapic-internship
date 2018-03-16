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
let sha1 = require('sha1');

let auth = require('./auth');
let config = require('../config');

let User = require('../models/userSchema');

/**
 * Takes 3 parameters(request,result,next) and returns result data.
 * @param   {object} req be the first object
 * @param   {object} res be the second object
 * @param   {object} next is called for calling any next function in the chain
 *
 * @returns {object} the final result object
 */

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

module.exports = router;