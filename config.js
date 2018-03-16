/**
 * Created by sanu on 16/3/18.
 */

let express = require('express');
let router = express.Router();
let ranndomstring = require("randomstring");

// JWT Secret Key
router.jwt_token = "Hy5JrAbDHHgba7cC";
router.mongoURI = "mongodb://root:nosqlnosql@ds012188.mlab.com:12188/scapic"

module.exports = router;