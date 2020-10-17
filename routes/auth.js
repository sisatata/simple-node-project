const expess = require('express');
const {register, login, getMe, forgotPassword, resetPassword,updateDetails,updatePassword} = require('../contorllers/auth');
const {protect} = require('../middleware/auth')
const router = expess.Router();
router.post('/register', register).post('/login', login);
router.put('/updatedetails',protect, updateDetails);
router.put('/updatepassword',protect,updatePassword);
router.get('/me', protect, getMe).post('/forgotpassword', forgotPassword).put('/resetpassword/:resettoken', resetPassword);
module.exports = router;
