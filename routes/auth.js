/**
 * Created by sanu on 16/3/18.
 */
/*jslint es6 */
"use strict"
let express = require('express');
let router = express.Router();
let jwt = require('jsonwebtoken');
let async = require('async');
let validator = require("validator");
let mongoose = require('mongoose');
let sha1 = require('sha1');
let isBase64 = require('is-base64');


let auth = require('./auth');
let config = require('../config');

let User = require('../models/userSchema');
let Assets = require('./assets');

//Authentication
router.authentication = function (req, res, next) {
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
};

router.login = (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;
    if (email && password && Evalidator.validate(email)) {
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
            function (data, callback) {app.use('/user',routes);
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

router.editUser = function (req, res, next) {
    var valid = true;
    if(req.body.firstName)
        valid  = valid && validator.isAlpha(req.body.firstName);
    if (req.body.middleName) {
        valid = valid && validator.isAlpha(req.body.middleName);
    }
    if (req.body.lastName) {
        valid = valid && validator.isAlpha(req.body.lastName);
    }
    if (req.body.email) {
        valid = valid && validator.isEmail(req.body.email);
    }
    if(req.body.imageBase64 && !isBase64(req.body.imageBase64)){
        valid = false;
    }
    if (valid == false) {
        res.status(210).json({
            "info": "Invalid data"
        });
    } else {
        User.findById(req.userId, function (err, userObj) {
            if (err) {
                res.status(500).json({
                    message: "User Fetch Error",
                    error: err
                });
            } else if (!userObj) {
                res.status(404).json({
                    info: 'User Not Found'
                });
            }
            else {
                if(req.body.firstName)
                    userObj.name.firstName = req.body.firstName;
                if(req.body.middleName)
                    userObj.name.middleName = req.body.middleName;
                if(req.body.lastName)
                    userObj.name.lastName = req.body.lastName;
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

router.getUser = function (req,res,next) {
    User.findById(req.userId,
        'name email imageBase64'
        , function (err, userObj) {
            if (err) {
                res.status(500).json({
                    message: "User Fetch Error",
                    error: err
                });
            } else if (!userObj) {
                res.status(404).json({
                    info: 'User Not Found'
                });
            }
            else {
                res.status(200).json(userObj);
            }
        });
};

router.login = (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;
    if (email && password && validator.isEmail(email)) {
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
            console.log('Done Callback');
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