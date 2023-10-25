const mongoose = require('mongoose');

const connectDB = async () => {

    try {
        mongoose.set('strictQuery', false);
        const connectingDb = await mongoose.connect(process.env.MONGODB_URL);
        console.log(`MongoDB connected ${connectingDb.connection.host}`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
    }

}

module.exports = connectDB; 