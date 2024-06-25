// const express = require("express");
// const userRouter = express.Router();
// const userC = require("../controllers/user");
// const {
//   authenticate,
//   authAdmin,
//   authOperasional,
//   authKaryawan,
// } = require("../middleware/authMiddleware");
import express from "express";
import {
    addUser,
    deleteUser,
    editUser,
    getAllEmploye,
    getAllKaryawan,
    getAllUser,
    getUserById,
} from "../controllers/user.js";
import { authAdmin, authenticate } from "../middleware/authMiddleware.js";
const userRouter = express.Router();

//Routing Ambil dan Menambah User
userRouter.route("/user").get(authAdmin, getAllUser).post(authAdmin, addUser);

userRouter.route("/karyawan").get(authenticate, getAllKaryawan);

userRouter.route("/employee").get(authenticate, getAllEmploye);

//Routing Edit dan Hapus User berdasarkan idnya
userRouter
    .route("/user/:id")
    .get(authenticate, getUserById)
    .put(authenticate, editUser)
    .delete(authAdmin, deleteUser);

export default userRouter;
