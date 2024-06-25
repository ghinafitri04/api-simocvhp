import express from "express";
const dashRouter = express.Router();
import { allData } from "../controllers/dashboard.js";
import { authAdmin } from "../middleware/authMiddleware.js";
// const { verifyToken } = require("../middleware/verifyToken");

/* GET users listing. */
dashRouter.get("/dashboard", authAdmin, allData);

export default dashRouter;
