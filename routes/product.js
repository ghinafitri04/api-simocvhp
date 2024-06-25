// const express = require("express");
// const productRouter = express.Router();
// const productC = require("../controllers/product");
import express from "express";
import {
    addProduct,
    allProduct,
    deleteProduct,
    updateProduct,
} from "../controllers/product.js";
import { authAdmin, authenticate } from "../middleware/authMiddleware.js";
const productRouter = express.Router();

//Routing Ambil dan Menambah barang
productRouter
    .route("/product")
    .get(authenticate, allProduct)
    .post(authAdmin, addProduct);

//Routing Edit dan Hapus Barang berdasarkan id
productRouter
    .route("/product/:id")
    .put(authAdmin, updateProduct)
    .delete(authAdmin, deleteProduct);

export default productRouter;
