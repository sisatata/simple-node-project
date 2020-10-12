const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const fileupload = require('express-fileupload');
const mongoose = require('mongoose');
const bootcamps = require('../simple-node-project/routes/bootcamps');
const courses = require('../simple-node-project/routes/courses');
const connectDB = require('../simple-node-project/config/db');
const errorHandler = require('../simple-node-project/middleware/error')
//const connectDB = require('../simple-node-project/config/config.env');
dotenv.config({path: '../simple-node-project/config/config.env'});
connectDB();
console.log(process.env.PORT)
const PORT = process.env.PORT || 5000;
const app = express();
//mongoose.connect(process.env.MONGO_URI,{useUnifiedTopology:true, useNewUrlParser:true}).then(()=> console.log('ok')).catch((err)=> console.log(err));
app.use(express.json())
if (process.env.NODE_ENV === 'development ') {
    app.use(morgan('dev'));
}
app.use(fileupload());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use(errorHandler);
app.get('/', (req, res) => {
    res.status(200).json({success: true, data: {name: 'stata', age: 21}});
})
// listening to  server
app.listen(
    PORT,
    console.log('sever running')
);

