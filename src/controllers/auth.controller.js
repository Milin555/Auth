import userModel from "../models/user.model.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import config from "../config/config.js";



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
        const user = await userModel.create({name, email, password: hashedPassword});
        const accessToken = jwt.sign({id: user._id}, config.jwt_secret, {expiresIn: "15m"});
        const refreshToken = jwt.sign({id: user._id}, config.jwt_secret, {expiresIn: "7d"});
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        
        res.status(201).json({message: "User created successfully", user, accessToken});
   
}


export async function getMe(req, res) {
      const token = req.headers.authorization?.split(" ")[1];
      if(!token){
        return res.status(401).json({
            message: "token not found"
        })
      }
      const decoded = jwt.verify(token, config.jwt_secret);
      const user = await userModel.findById(decoded.id);
      res.status(200).json({
        message: "User found successfully",
        user:{
            
            name: user.name,
            email: user.email,
        }
      })
    
}


export async function refreshToken(req, res) {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
        return res.status(401).json({
            message: "Refresh token not found"
        })
    }
    const decoded = jwt.verify(refreshToken, config.jwt_secret);
    const accessToken = jwt.sign({id: decoded.id}, config.jwt_secret, {expiresIn: "15m"});

    const newRefreshToken = jwt.sign({id: decoded.id}, config.jwt_secret, {expiresIn: "7d"});
    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
        message: "Access token refreshed successfully",
        accessToken,
    })
}
