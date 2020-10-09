const mongoose = require('mongoose');

const BootcampShema = new mongoose.Schema({

    name: {
        type: String,

    }
});
module.exports = mongoose.model('Bootcamp', BootcampShema);
