const expess = require('express');
const {register, login, getMe, forgotPassword} = require('../contorllers/auth');
const {protect} = require('../middleware/auth')
const router = expess.Router();
router.post('/register', register).post('/login', login);
router.get('/me', protect, getMe).post('/fotgotpassword',forgotPassword);
module.exports = router;
