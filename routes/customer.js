// const express = require("express");
// const customerRouter = express.Router();
// const customerC = require("../controllers/customer");
import express from "express";
const customerRouter = express.Router();
import {
    allCustomer,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerById,
} from "../controllers/customer.js";
import {
    authAdmin,
    authenticate,
    authOperasional,
} from "../middleware/authMiddleware.js";

//Routing Ambil dan Menambah Customer
customerRouter
    .route("/customer")
    .get(authenticate, allCustomer)
    .post(authAdmin, addCustomer);

//Routing Edit dan Hapus Customer berdasarkan idnya
customerRouter
    .route("/customer/:id")
    .get(authenticate, getCustomerById)
    .put(authAdmin, updateCustomer)
    .delete(authAdmin, deleteCustomer);

export default customerRouter;
