// const express = require("express");
// const productTypeRouter = express.Router();
// const productTypeC = require("../controllers/productTypeRouter");
import express from "express";
import {
    addProductType,
    allProductType,
    deleteProductType,
    updateProductType,
} from "../controllers/productType.js";
import { authAdmin } from "../middleware/authMiddleware.js";
const productTypeRouter = express.Router();

//Routing Ambil dan Menambah Tipe Barang
productTypeRouter
    .route("/productType")
    .get(authAdmin, allProductType)
    .post(authAdmin, addProductType);

//Routing Edit dan Hapus Barang berdasarkan idnya
productTypeRouter
    .route("/productType/:id")
    .put(authAdmin, updateProductType)
    .delete(authAdmin, deleteProductType);

export default productTypeRouter;
