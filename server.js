const express = require('express');
const dotenv = require('dotenv');

const bootcamps = require('../simple-node-project/routes/bootcamps');
dotenv.config({path: './config/config.env'});

const PORT = process.env.PORT || 5000;
const app = express();
app.use('/api/v1/bootcamps', bootcamps);
app.get('/', (req, res) => {

    res.status(200).json({success: true, data: {name: 'stata', age: 21}});
})
// listening to  server

app.listen(
    PORT,
    console.log('sever running')
);


/*  neccessary shortcuts for webstorm
*  shift + shift
*  F2
* ctrl + e
* ctrl  + w
*  shift + F6
* ctrl + alt + S
*
* */