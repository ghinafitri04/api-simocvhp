// const express = require("express");
// const customerDetailsRouter = express.Router();
// const cDetailC = require("../controllers/customerDetails");
import express from "express";
import {
    addCustomerDetails,
    deleteCustomerDetails,
    getCustomerDetailsByCustomerId,
    updateCustomerDetails,
} from "../controllers/customerDetails.js";
import { authAdmin, authenticate } from "../middleware/authMiddleware.js";
const customerDetailsRouter = express.Router();

customerDetailsRouter
    .route("/customerDetails/:id")
    .get(authenticate, getCustomerDetailsByCustomerId)
    .post(authAdmin, addCustomerDetails);

customerDetailsRouter
    .route("/customerDetails/:id/:productId")
    .put(authAdmin, updateCustomerDetails)
    .delete(authAdmin, deleteCustomerDetails);

export default customerDetailsRouter;
