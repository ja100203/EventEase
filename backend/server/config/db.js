const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URI, {
        });
        console.log("MongoDB Connected...");
    } catch (error) {
        console.error("Database Connection Failed", error);
        process.exit(1);
    }
};

module.exports = connectDB;
