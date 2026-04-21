import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        unique: [true, "Name must be unique"],
    },
    email: {
        type: String, 
        required: [true, "Email is required"],
        unique: [true, "Email must be unique"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
});

const userModel = mongoose.model("users", userSchema);

export default userModel;