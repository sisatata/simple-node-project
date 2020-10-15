const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const fileupload = require('express-fileupload');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const connectDB = require('../simple-node-project/config/db');
const errorHandler = require('../simple-node-project/middleware/error')
dotenv.config({path: '../simple-node-project/config/config.env'});
connectDB();
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
console.log(process.env.PORT)
const PORT = process.env.PORT || 5000;
const app = express();
app.use(cookieParser());
//mongoose.connect(process.env.MONGO_URI,{useUnifiedTopology:true, useNewUrlParser:true}).then(()=> console.log('ok')).catch((err)=> console.log(err));
app.use(express.json())
if (process.env.NODE_ENV === 'development ') {
    app.use(morgan('dev'));
}
app.use(fileupload());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use(errorHandler);
app.get('/', (req, res) => {
    res.status(200).cookie('aa', 'aaa').json({success: true, data: {name: 'stata', age: 21}});
})
// listening to  server
app.listen(
    PORT,
    console.log('sever running')
);

