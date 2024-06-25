// const express = require("express");
// const mouRouter = express.Router();
// const mouC = require("../controllers/mou");
import express from "express";
import {
    addMou,
    allMou,
    deleteMou,
    getMouById,
    multerMou,
    updateMou,
} from "../controllers/mou.js";
import { authAdmin } from "../middleware/authMiddleware.js";
const mouRouter = express.Router();

//Routing Ambil dan Menambah mou
mouRouter
    .route("/mou")
    .get(authAdmin, allMou)
    .post(authAdmin, multerMou, addMou);

//Routing Edit dan Hapus mou berdasarkan idnya
mouRouter
    .route("/mou/:id")
    .get(authAdmin, getMouById)
    .put(authAdmin, multerMou, updateMou)
    .delete(authAdmin, deleteMou);

export default mouRouter;
