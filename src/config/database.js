import mongoose from "mongoose";
import config from "./config.js";

async function connectDB() {
    try {
        await mongoose.connect(config.mongo_url);
        console.log("Database connected");
    } catch (error) {
        console.log(error);
    }
};

export default connectDB;