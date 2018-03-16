/**
 * Created by sanu on 16/3/18.
 */

let express = require('express');
let router = express.Router();
let ranndomstring = require("randomstring");

// JWT Secret Key
router.jwt_token = ranndomstring.generate(10);

module.exports = router;