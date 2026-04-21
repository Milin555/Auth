import userModel from "../models/user.model.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";



export async function register(req, res) {
   
        const {name, email, password} = req.body;
        const isAlreadyRegistered = await userModel.findOne({
            $or: [
                {name},
                {email} 
            ]
        });
        if(isAlreadyRegistered){
            return res.status(409).json({message: "User or email already registered"});
        }
        const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
        const user = await userModel.create({name, email, hashedPassword});
        res.status(201).json({message: "User created successfully", user});
   
}

