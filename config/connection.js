const  mongoose = require('mongoose');

async function connectDB(url){
    await mongoose.connect(url)
    .then(()=> {
        console.log("MongoDB connected successfully.");
    })
    .catch((err) => {
        console.log('Error in connecting to DB.\n', err);
        return;
    })
}

module.exports = {
    connectDB
}