const express = require('express');
const {getCourses, getCourse, addCourse, updateCourse, deleteCourse} = require('../contorllers/courses');
const {protect} = require('../middleware/auth');
const router = express.Router({mergeParams: true});
const Course = require('../models/Course');
const advancedResults = require('../middleware/advancedResults');
router.route('/')
    .get(advancedResults(Course, {path: 'bootcamp', select: 'name description'}), getCourses).post(protect, addCourse);
;
router.route('/:id').get(getCourse).put(updateCourse).delete(deleteCourse);
;
module.exports = router;


