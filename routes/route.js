/**
 * Created by sanu on 16/3/18.
 */
let express = require('express');
let router = express.Router();

let auth = require('./auth');

router.post('/login', auth.login);
router.post('/register', auth.createUser);
router.post('/edit',auth.authentication, auth.editUser);
router.get('/view',auth.authentication, auth.getUser);

module.exports = router;

