const catchAsyncError = require("../middleware/catchAsyncError");
const userModel = require("../models/userModel");
const sendEmail = require("../utils/email");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwt");
const crypto = require("crypto")

// registerUser - /api/v1/register
exports.registerUser = catchAsyncError(async(req, res, next) => {
    const {name, email, password, avatar } = req.body;
    const user = await userModel.create({
        name,
        email,
        password,
        avatar
    });

        sendToken(user, 200, res)

})

// loginUser - /api/v1/login
exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password} = req.body;
    if(!email || !password){
        return next(new ErrorHandler('Please enter email & password', 400))
    }

    // finding the user database
    const user = await userModel.findOne({email}).select('+password')

    if(!user){
        return next(new ErrorHandler('Invalid email or password', 401))
    }
    if(! await user.isValidPassword(password)){
        return next(new ErrorHandler('Invalid email or password', 401))

    }

    sendToken(user, 200, res)
})

// logoutUser - /api/v1/logout
exports.logoutUser = (req, res, next) =>{
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    }).status(200).json({
        success: true,
        message: 'Logged out'
    })
}

// forgetPassword - /api/v1/password/forgot
exports.forgetPassword = catchAsyncError(async(req, res, next) => {

    const user = await userModel.findOne({email: req.body.email});

    if (!user) {
        return next(new ErrorHandler('User not found with this email', 404))
    }
    const resetTokenPassword = user.getResetPasswordToken();

    const saved= await user.save({validateBeforeSave:false})

    
    // create resetUrl
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetTokenPassword}`

    const message =`Your password reset url is as follows \n \n
    ${resetUrl} \n \n If you have not requested this email, then ignore it.`

    try{
        await sendEmail({
            email:user.email,
            subject: "z cart Passsword Recovery",
            message
        })
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} `
        })


    }catch(error){
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpire = undefined;
        await user.save({validateBeforeSave: false});
        return next(new ErrorHandler(error.message, 500))
    }
})

// resetPassword - /api/v1/password/reset/:token
exports.resetPassword = catchAsyncError(async(req, res, next) => {

    const resetPasswordToken = crypto.createHash('sha256')
            .update(req.params.token)
            .digest('hex');

    const user = await userModel.findOne({
        resetPasswordToken,
        resetPasswordTokenExpire: { $gt: Date.now() }
    });
    
    if(!user){
        return next(new ErrorHandler("Password reset token is invalid or expired"));
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match"));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });

    sendToken(user, 200, res)
})
