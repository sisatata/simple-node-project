const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bootcamps = require('../simple-node-project/routes/bootcamps');
const connectDB = require('../simple-node-project/config/db');
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

app.use('/api/v1/bootcamps', bootcamps);
app.get('/', (req, res) => {

    res.status(200).json({success: true, data: {name: 'stata', age: 21}});
})
// listening to  server

app.listen(
    PORT,
    console.log('sever running')
);

