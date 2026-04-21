import dotenv from "dotenv";
dotenv.config();

if (!process.env.MONGO_URL) {
    throw new Error("Please provide MONGO_URL in the enivorment file");
}


export const config = {
    jwt_secret: process.env.JWT_SECRET,
    mongo_url: process.env.MONGO_URL,
};

export default config;