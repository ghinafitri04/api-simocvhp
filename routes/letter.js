// const express = require("express");
// const letterRouter = express.Router();
// const letterC = require("../controllers/letter");
import express from "express";
import {
    addLetter,
    allLetter,
    deleteLetter,
    editLetter,
    getLetterById,
    getLetterByUserId,
    multerLetter,
    rejectLetter,
    verifyLetter,
} from "../controllers/letter.js";
import {
    authAdmin,
    authKaryawan,
    authenticate,
} from "../middleware/authMiddleware.js";
const letterRouter = express.Router();

//Routing Ambil dan Menambah Surat
letterRouter
    .route("/letter")
    .get(authAdmin, allLetter)
    .post(authKaryawan, multerLetter, addLetter);

letterRouter.route("/myLetter").get(authKaryawan, getLetterByUserId);

//Routing Edit dan Hapus Barang berdasarkan slugnya
letterRouter
    .route("/letter/:id")
    .get(authenticate, getLetterById)
    .put(authAdmin, verifyLetter)
    .patch(authAdmin, rejectLetter)
    .delete(authenticate, deleteLetter);

letterRouter
    .route("/letter/edit/:id")
    .put(authKaryawan, multerLetter, editLetter);

export default letterRouter;
