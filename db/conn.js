const mongoose = require("mongoose");

require('dotenv').config();
const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI,{useFindAndModify:false,useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex:true});
        console.log("Connected to database: "+connection.connection.host)
    }
    catch {
        console.log(`Can't Connect`)
    }
};

module.exports = connectDB; 