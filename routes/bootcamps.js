const express = require('express');
const {getBootcamps, getBootcamp, createBootcamp, deleteBootcamp, updateBootcamp,uploadPhotoBootcamp} = require('../contorllers/bootcamps');

const courseRouter = require('./courses');
const router = express.Router();

router.use('/:bootcampId/courses',courseRouter);
router.route('/')
    .get(getBootcamps)
    .post(createBootcamp);



router.route('/:id')
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp);

router.route('/:id/photo').put(uploadPhotoBootcamp)

module.exports = router;


