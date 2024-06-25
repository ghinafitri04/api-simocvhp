// const express = require("express");
// const letterTypeRouter = express.Router();
// const letterTypeC = require("../controllers/letterType");
import express from "express";
import {
    addLetterType,
    allLetterType,
    deleteLetterType,
    updateLetterType,
} from "../controllers/letterType.js";
import { authAdmin, authenticate } from "../middleware/authMiddleware.js";
const letterTypeRouter = express.Router();

//Routing Ambil dan Menambah Jenis Surat
letterTypeRouter
    .route("/letterType")
    .get(authenticate, allLetterType)
    .post(authAdmin, addLetterType);

//Routing Edit dan Hapus Barang berdasarkan idnya
letterTypeRouter
    .route("/letterType/:id")
    .put(authAdmin, updateLetterType)
    .delete(authAdmin, deleteLetterType);

export default letterTypeRouter;
