const productModel = require('../models/productModel');
const errorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middleware/catchAsyncError');
const ApiFeature = require('../utils/apiFeature');


// Get all data - /api/v1/products
    exports. getProducts = catchAsyncError(async (req, res, next)=>{
        const resultPerPage = 2;
            const apiFeature =  new ApiFeature(productModel.find(), req.query)
                                             .search()
                                             .filter()
                                             .paginate(resultPerPage);
        let findProduct = await apiFeature.query;
        res.status(200).json({
            success:true,
            count:findProduct.length,
            findProduct
        })
    })

// Creating data - /api/v1/product/new
exports.newProduct = catchAsyncError(async (req, res, next) =>{
   let createdProduct = await productModel.create(req.body);
    res.status(201).json({
        success:true,
        createdProduct
    })
})

// Get single data -/api/v1/product/:id
exports.getSingleProduct =async (req, res, next)=> {
    let singleProduct = await productModel.findById(req.params.id);
    
    if(!singleProduct){
      return next(new errorHandler("Product not found ", 404))
    }

    res.status(201).json({
        success: true,
        singleProduct
    })
}

// updata data -/api/v1/product/:id
exports.updateProduct =async (req, res, next)=> {
    let product = await productModel.findById(req.params.id);
    
    if(!product){
        return res.status(404).json({
            success:false,
            message: "product not found"
        })
    }

    product = await productModel.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
        runValidators:true
    })

    res.status(201).json({
        success: true,
        product
    })
}

// delete data -/api/v1/product/:id
exports.deleteProduct =async (req, res, next)=> {
    let product = await productModel.findById(req.params.id);
    
    if(!product){
        return res.status(404).json({
            success:false,
            message: "product not found"
        })
    }

    await productModel.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message:"Product Deleted!"
    })
}