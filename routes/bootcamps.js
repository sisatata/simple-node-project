const express = require('express');

const {getBootcamps, getBootcamp, createBootcamp, deleteBootcamp, updateBootcamp} = require('../contorllers/bootcamps');
const router = express.Router();

router.route('/')
    .get(getBootcamps)
    .post(createBootcamp);

router.route('/:id')
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp);

module.exports = router;


