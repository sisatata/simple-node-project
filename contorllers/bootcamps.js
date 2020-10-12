const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const path = require('path');
// @desc    show all bootcamps
// @route   Get/api/v1/bootcamps
// @access  public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    let query;
    let reqQuery = {...req.query};
    // remove from query
    let removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');
    // query with select
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }
    // query with sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }
    // pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 1;
    //console.log(page);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Bootcamp.countDocuments();
    query = query.skip(startIndex).limit(limit);
    const bootcamps = await query;
    const pagination = {};
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }
    res.status(200).json({success: true, data: bootcamps, pagination});
});
// @desc    show single bootcamp
// @route   Get/api/v1/bootcamps/:id
// @access  public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    console.log(req.params.id);
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`resource not found with the id ${req.params.id}`, 404));
    }
    res.status(200).json({success: true, data: bootcamp});
    // res.status(400).json({success: false});
    //  next(new ErrorResponse(`Bootcamp not found with the id ${req.params.id}`, 404));
});
// @desc    create bootcamp
// @route   Post/api/v1/bootcamps
// @access  public
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({success: true, data: bootcamp});
});
// @desc    update bootcamp
// @route   Put/api/v1/bootcamp/s:id
// @access  public
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!bootcamp) {
        return
        next(new ErrorResponse(`Bootcamp not found with the id ${req.params.id}`, 404));
    }
    res.status(200).json({success: true, data: bootcamp});
});
// @desc    delete bootcamp
// @route   Del/api/v1/bootcamps/:id
// @access  private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return
        next(new ErrorResponse(`Bootcamp not found with the id ${req.params.id}`, 404));
    }
    bootcamp.remove();
    res.status(200).json({success: true})
});
// @desc    upload photo bootcamp
// @route   Put/api/v1/bootcamps/:id
// @access  private
exports.uploadPhotoBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    //console.log(bootcamp)
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with the id ${req.params.id}`, 404));
    }
    if (!req.files) {
        return next(new ErrorResponse(`Please upload a file`, 400));
    }
    const file = req.files.files;
    //console.log(file)
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload a file`, 400));
    }
    // console.log('after mimne')
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400));
    }
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            return next(new ErrorResponse(`Problem with file upload`, 400));
        }
        await Bootcamp.findByIdAndUpdate(req.params.id, {photo: file.name});
        res.status(200).json({
            success: true,
            data: file.name
        })
    })
});


