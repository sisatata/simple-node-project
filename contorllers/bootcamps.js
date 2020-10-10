const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
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
    query = Bootcamp.find(JSON.parse(queryStr));
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
    console.log(req.body);
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return
        next(new ErrorResponse(`Bootcamp not found with the id ${req.params.id}`, 404));
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
// @access  public
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
        return
        next(new ErrorResponse(`Bootcamp not found with the id ${req.params.id}`, 404));
    }
    res.status(200).json({success: true})
});
// exports.updateBootcamps = asyncHandler( async (req,res,next)  => {
//     console.log('fef')
//     const bootcamps = await Bootcamp.findByIdAndUpdate('5d713995b721c3bb38c1f5d0', {$set :{ averageCost : 1000}}, {
//         new: true,
//         runValidators: true
//     });
//     if(!bootcamps){
//         return
//         next(new ErrorResponse(`Bootca`,404));
//
//     }
//     res.status(200).json({success: true})
//
// });

