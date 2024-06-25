// const express = require("express");
// const inspectionRouter = express.Router();
// const inspectC = require("../controllers/inspection");
import express from "express";
import {
    addInspection,
    allInspection,
    deleteInspection,
    editInspection,
    getInspectionByCustomerId,
    getInspectionById,
    getInspectionByUserId,
    inspect,
} from "../controllers/inspection.js";
const inspectionRouter = express.Router();
import {
    authenticate,
    authKaryawan,
    authOperasional,
} from "../middleware/authMiddleware.js";

//Routing Ambil dan Menambah Inspeksi
inspectionRouter
    .route("/inspection")
    .get(authOperasional, allInspection)
    .post(authOperasional, addInspection);

// Untuk karyawan
inspectionRouter
    .route("/myInspection")
    .get(authKaryawan, getInspectionByUserId);

//Routing Edit dan Hapus Inspeksi berdasarkan idnya
inspectionRouter
    .route("/inspection/:id")
    .get(authenticate, getInspectionByCustomerId)
    .put(authKaryawan, inspect)
    .delete(authOperasional, deleteInspection);

inspectionRouter
    .route("/inspectionDetail/:id")
    .get(authenticate, getInspectionById)
    .put(authOperasional, editInspection);

export default inspectionRouter;
