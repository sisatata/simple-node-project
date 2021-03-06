const Course = require('../models/Course');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require('../models/Bootcamp');
// @desc    get all course
// @route   GET/api/v/courses
// @route   GET/api/v1/bootcmps/:bootcampId/courses
// @access  public
exports.getCourses = asyncHandler(async (req, res, next) => {
    if (req.params.bootcampId) {
        const courses = await Course.find({bootcamp: req.params.bootcampId});
        return res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });
    } else {
        console.log('from course')
        res.status(200).json(res.advancedResults);
    }
});
// @desc    get single course
// @route   GET/api/v1/course/:id
// @access  public
exports.getCourse = asyncHandler(async (req, res, next) => {
    console.log('fasf')
    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });
    if (!course) {
        return next(new ErrorResponse(`resource not found with the id ${req.params.id}`, 404));
    }
    res.status(200).json({
        success: true,
        data: course
    })
});
// @desc    add single course
// @route   POST/api/v1/course/:id
// @access  private
exports.addCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
    if (!bootcamp) {
        return
        next(new ErrorResponse(`resource not found with the id ${req.params.id}`, 404));
    }
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`${req.user.id} not authorized to create course under this bootcamp`, 401));
    }
    const course = await Course.create(req.body);
    res.status(200).json({
        success: true,
        data: course
    })
});
// @desc    update single course
// @route   PUT/api/v1/course/:id
// @access  private
exports.updateCourse = asyncHandler(async (req, res, next) => {
    let course = await Course.findById(req.params.id);
    if (!course) {
        return
        next(new ErrorResponse(`resource not found with the id ${req.params.id}`, 404));
    }
    if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`${req.user.id} not authorized to update this course`, 401));
    }
    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        success: true,
        data: course
    });
});
// @desc    delete single course
// @route   DELETE/api/v1/course/:id
// @access  private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
    console.log(req.params.id);
    const course = await Course.findById(req.params.id);
    console.log(course)
    if (!course) {
        // console.log(';fasfdas')
        return next(new ErrorResponse(`resource not found with the id ${req.params.id}`, 404));
    }
    if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
        next(new ErrorResponse(`${req.user.id} not authorized to delete this course`, 401));
    }
    await course.remove();
    res.status(200).json({
        success: true,
        data: {}
    });
});

