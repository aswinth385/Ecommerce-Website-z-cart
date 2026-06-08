const productsData =require('../data/product.json');
const productModel =require('../models/productModel');
const connectDb =require('../config/database')


const path =require('path');
const dotenv =require('dotenv');
dotenv.config({path:path.join(__dirname,'../config/config.env')})

connectDb();

const seedProduct = async ()=> {

    try{
    await productModel.deleteMany();
    console.log("All products deleted!");
    
    await productModel.insertMany(productsData);
    console.log("All products inserted");
    }
    catch(error){
        console.log(error.message);
    }
    process.exit();
}

seedProduct();