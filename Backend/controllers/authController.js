const catchAsyncError = require("../middleware/catchAsyncError");
const userModel = require("../models/userModel");


exports.registerUser = catchAsyncError(async(req, res, next) => {
    const {name, email, password, avator } = req.body;
    const user = await userModel.create({
        name,
        email,
        password,
        avator
    });

    const token = user.getJwtToken()

    res.status(201).json({
        success: true,
        user,
        token
    })
})

