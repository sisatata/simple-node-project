const expess = require('express');
const {register, login} = require('../contorllers/auth');
const router = expess.Router();
router.post('/register', register).post('/login', login);
module.exports = router;
