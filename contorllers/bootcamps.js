const Bootcamp = require('../models/Bootcamp');

// @desc    show all bootcamps
// @route   Get/api/v1/bootcamps
// @access  public

exports.getBootcamps = (req, res, next) => {
    res.status(200).json({success: true, msg: 'Show all '});

}

// @desc    show single bootcamp
// @route   Get/api/v1/bootcamps/:id
// @access  public

exports.getBootcamp = (req, res, next) => {
    res.status(200).json({success: true, msg: 'Show single '});

}

// @desc    create bootcamp
// @route   Post/api/v1/bootcamps
// @access  public

exports.createBootcamp = async (req, res, next) => {
    console.log(req.body);
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({success: true, data: bootcamp});

}

// @desc    update bootcamp
// @route   Put/api/v1/bootcamp/s:id
// @access  public

exports.updateBootcamp = (req, res, next) => {
    res.status(200).json({success: true, msg: 'update a bootcamp'});

}
// @desc    delete bootcamp
// @route   Del/api/v1/bootcamps/:id
// @access  public

exports.deleteBootcamp = (req, res, next) => {
    res.status(200).json({success: true, msg: `deleted id = ${req.params.id}`});

}