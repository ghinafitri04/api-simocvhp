// const user = require("../models/user");
// const bcrypt = require("bcrypt");
// require("dotenv").config();
// const {
//     generateAccessToken,
//     generateRefreshToken,
//     parseJWT,
//     verifyRefreshToken,
//     verifyAccessToken,
// } = require("../utils/jwt");

import user from "../models/user.js";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
  parseJWT,
  verifyRefreshToken,
  verifyAccessToken,
} from "../utils/jwt.js";

const setLogin = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    const userExists = await user.findOne({
      where: {
        username: username,
      },
    });
    if (!userExists) {
      return res.status(400).json({
        errors: ["User not found"],
        message: "Login Failed",
      });
    }
    const match = await bcrypt.compare(
      password,
      userExists.password,
      async (err, result) => {
        if (err || !result) {
          return res.status(401).json({
            msg: "Password wrong",
          });
        }
        const usr = {
          id: userExists.id,
          user_name: userExists.user_name,
          username: userExists.username,
          role: userExists.role,
        };
        const token = generateAccessToken(usr);
        const refreshToken = generateRefreshToken(usr);

        // req.session.user_id = user.id;

        return res.status(200).json({
          errors: [],
          message: "Login successfully",
          data: usr,
          accessToken: token,
          refreshToken: refreshToken,
        });
      }
    );
  } catch (error) {
    next(
      new Error("controllers/userController.js:setLogin - " + error.message)
    );
  }
};

const setRefreshToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    // console.log("Authorization Header:", authHeader);
    // const token = authHeader && authHeader.split(" ")[1];
    const token =
      authHeader &&
      (authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader);
    // console.log("Extracted Token:", token);
    if (!token) {
      return res.status(401).json({
        errors: ["Refresh token not found"],
        message: "Refresh Failed",
        data: null,
      });
    }
    const verify = verifyRefreshToken(token);
    if (!verify) {
      return res.status(401).json({
        errors: ["Invalid refresh token"],
        message: "Refresh Failed",
        data: null,
      });
    }
    // let data = parseJWT(token);
    const data = verify;
    console.log("Verified Data:", data); // Log the verified data

    const userRecent = await user.findOne({
      where: {
        id: data.id,
      },
    });
    if (!userRecent) {
      return res.status(404).json({
        errors: ["User not found"],
        message: "Refresh Failed",
        data: null,
      });
    } else {
      const usr = {
        id: userRecent.id,
        user_name: userRecent.user_name,
        username: userRecent.username,
        role: userRecent.role,
      };
      const token = generateAccessToken(usr);
      const refreshToken = generateRefreshToken(usr);
      return res.status(200).json({
        errors: [],
        message: "Refresh successfully",
        data: usr,
        accessToken: token,
        refreshToken: refreshToken,
      });
    }
  } catch (error) {
    next(
      new Error(
        "controllers/userController.js:setRefreshToken - " + error.message
      )
    );
  }
};

const editPassword = async (req, res, next) => {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;

  try {
    // Cari user berdasarkan ID
    const userToUpdate = await user.findOne({
      where: {
        id: userId,
      },
    });
    console.log(userId);

    if (!userToUpdate) {
      return res.status(404).json({
        status: "failed",
        message: "User tidak ditemukan",
      });
    }

    // Verifikasi password lama
    const isMatch = await bcrypt.compare(oldPassword, userToUpdate.password);
    console.log(userToUpdate.password);
    if (!isMatch) {
      return res.status(401).json({
        status: "failed",
        message: "Password lama salah",
      });
    }

    // Hash password baru
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password user
    userToUpdate.password = hashedPassword;
    userToUpdate.updatedAt = new Date();
    await userToUpdate.save();

    res.status(200).json({
      status: "ok",
      message: "Password berhasil diubah",
    });
  } catch (error) {
    next(
      new Error("controllers/userController.js:editPassword - " + error.message)
    );
  }
};

export { setLogin, setRefreshToken, editPassword };
