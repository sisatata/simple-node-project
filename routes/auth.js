const expess = require('express');
const {register, login,getMe} = require('../contorllers/auth');
const {protect}  = require('../middleware/auth')
const router = expess.Router();
router.post('/register', register).post('/login', login);
router.get('/me',protect,getMe)
module.exports = router;
