const app = require('./app');   //Import the app

const path = require('path');
const dotenv = require('dotenv');
dotenv.config({path:path.join(__dirname,'/config/config.env')});

const connectDb = require('./config/database'); //import the connectDb want to connect mongodb
connectDb();                                    // here we call it connectDb()

const server = app.listen(process.env.PORT,() => {
    console.log(`Server is listening to ${process.env.PORT} in ${process.env.NODE_ENV}`);
})

process.on("unhandledRejection",(err) =>{
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to unhandled rejection error");
    server.close(() => {
        process.exit(1);
    })
} )

process.on("uncaughtException",(err) =>{
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to uncaught exception error");
    server.close(() => {
        process.exit(1);
    })
})
