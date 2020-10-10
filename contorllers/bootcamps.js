const Bootcamp = require('../models/Bootcamp');
// @desc    show all bootcamps
// @route   Get/api/v1/bootcamps
// @access  public
exports.getBootcamps = async (req, res, next) => {
    try {
        const bootcamps = await Bootcamp.find();
        res.status(200).json({success: true, msg: bootcamps});
    } catch (err) {
        res.status(400).json({success: false});
    }
}
// @desc    show single bootcamp
// @route   Get/api/v1/bootcamps/:id
// @access  public
exports.getBootcamp = async (req, res, next) => {
    try {
        console.log(req.params.id)
        const bootcamp = await Bootcamp.findById(req.params.id);
        if (!bootcamp) {
            res.status(400).json({success: false});
        }
        res.status(200).json({success: true, data: bootcamp});
    } catch (err) {
        res.status(400).json({success: false});
    }
}
// @desc    create bootcamp
// @route   Post/api/v1/bootcamps
// @access  public
exports.createBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.create(req.body);
        res.status(201).json({success: true, data: bootcamp});
    } catch (err) {
        res.status(400).json({success: true});
    }
}
// @desc    update bootcamp
// @route   Put/api/v1/bootcamp/s:id
// @access  public
exports.updateBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!bootcamp) {
            res.status(400).json({success: false, msg: 'No such bootcamp'});
        }
        res.status(200).json({success: true, data: bootcamp});
    } catch (err) {
        res.status(400).json({success: false});
    }
}
// @desc    delete bootcamp
// @route   Del/api/v1/bootcamps/:id
// @access  public
exports.deleteBootcamp = async (req, res, next) => {
    try {
        await Bootcamp.findByIdAndDelete(req.params.id);
        res.status(200).json({success: true})
    } catch (err) {
        res.status(200).json({success: true, data: `deleted id = ${req.params.id}`});
    }
}