const mongoose = require('mongoose');

const connectDb =()=>{
    mongoose.connect(process.env.DB_LOCAL_URI)
    .then((connect) => {
        console.log(`Mongodb is connected to the host ${connect.connection.host}`)
    })
}



module.exports=connectDb;