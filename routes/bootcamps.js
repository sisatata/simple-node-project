const express = require('express');
const {getBootcamps, getBootcamp, createBootcamp, deleteBootcamp, updateBootcamp, uploadPhotoBootcamp} = require('../contorllers/bootcamps');
const courseRouter = require('./courses');
const router = express.Router();
const Bootcamp = require('../models/Bootcamp');
const {protect} = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
router.use('/:bootcampId/courses', courseRouter);
router.route('/')
    .get(advancedResults(Bootcamp, 'course'), getBootcamps)
    .post(protect,createBootcamp);
router.route('/:id')
    .get(getBootcamp)
    .put(protect, updateBootcamp)
    .delete(protect, deleteBootcamp);
router.route('/:id/photo').put(uploadPhotoBootcamp)
module.exports = router;


