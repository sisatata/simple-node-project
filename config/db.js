const mongoose = require('mongoose');
const MONGO_URI = 'mongodb://satata:satata@geo-shard-00-00.xs2uj.mongodb.net:27017,geo-shard-00-01.xs2uj.mongodb.net:27017,geo-shard-00-02.xs2uj.mongodb.net:27017/test?ssl=true&replicaSet=atlas-1155bz-shard-0&authSource=admin&retryWrites=true&w=majoritys';
console.log(process.env.MONGO_URI)
const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false

    });
    console.log('conneceted');
}
module.exports = connectDB;