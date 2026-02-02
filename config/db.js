const mongoose = require("mongoose");
const mongo_uri = process.env.MONGO_URI

const connectDb = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log('DB Connected Successfully');
        })
        await mongoose.connect(mongo_uri)
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDb