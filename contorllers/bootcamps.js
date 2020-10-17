const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const advancedResults = require('../middleware/advancedResults');
const path = require('path');
// @desc    show all bootcamps
// @route   Get/api/v1/bootcamps
// @access  public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    console.log(req.params);
    res.status(200).json(res.advancedResults);
});
// @desc    show single bootcamp
// @route   Get/api/v1/bootcamps/:id
// @access  public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    console.log(req.body);
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
    //console.log(req.body);
    console.log(req.user.id)
    console.log('safasfasfaaaaaaaaa')
    req.body.user = req.user.id;
    //console.log(' i am create bootcmpa')
    const publishedBootcamp = await Bootcamp.findOne({user: req.user.id});
    // console.log(publishedBootcamp)
    if (publishedBootcamp && req.user.role !== 'admin') {
        next(new ErrorResponse(`The id already publish a bootcamp ${req.user.id}`, 404));
    }
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({success: true, data: bootcamp});
});
// @desc    update bootcamp
// @route   Put/api/v1/bootcamp/s:id
// @access  public
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    let bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return
        next(new ErrorResponse(`Bootcamp not found with the id ${req.params.id}`, 404));
    }

    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        next(new ErrorResponse(`${req.user.id} not authorized to update this bootcamp`, 401));
    }
    bootcamp = await Bootcamp.findOneAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    })
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
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`${req.user.id} not authorized to delete this bootcamp`, 401));
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


