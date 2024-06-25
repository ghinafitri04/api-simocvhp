// const jsonWebToken = require("jsonwebtoken");
// require("dotenv").config();
import jsonWebToken from "jsonwebtoken";
import "dotenv/config";

const generateAccessToken = (user) => {
    return jsonWebToken.sign(
        {
            id: user.id,
            user_name: user.user_name,
            username: user.username,
            role: user.role, // Add role to the JWT payload
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "1800s",
        }
    );
};

const generateRefreshToken = (user) => {
    return jsonWebToken.sign(
        {
            id: user.id,
            role: user.role, // Add role to the JWT payload
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "86400s",
        }
    );
};

const verifyRefreshToken = (token) => {
    try {
        const decoded = jsonWebToken.verify(
            token,
            process.env.JWT_REFRESH_SECRET
        );
        return {
            id: decoded.id,
            role: decoded.role, // Extract role from the decoded token
        };
    } catch (error) {
        return null;
    }
};

const parseJWT = (token) => {
    try {
        const decoded = jsonWebToken.decode(token);
        return {
            id: decoded.id,
            user_name: decoded.user_name,
            username: decoded.username,
            role: decoded.role, // Extract role from the decoded token
        };
    } catch (error) {
        return null;
    }
};

const verifyAccessToken = (token) => {
    try {
        const decoded = jsonWebToken.verify(token, process.env.JWT_SECRET);
        return {
            id: decoded.id,
            user_name: decoded.user_name,
            username: decoded.username,
            role: decoded.role, // Extract role from the decoded token
        };
    } catch (err) {
        console.error("Failed verifying:" + err);
        return null;
    }
};

export {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    parseJWT,
    verifyAccessToken,
};
