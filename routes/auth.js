import express from "express";
const authRouter = express.Router();
import {
    editPassword,
    setLogin,
    setRefreshToken,
} from "../controllers/auth.js";
import { authenticate } from "../middleware/authMiddleware.js";
// const { verifyToken } = require("../middleware/verifyToken");

/* GET users listing. */
authRouter.get("/login", function (req, res) {
    res.send("Log in Brow");
});
authRouter.post("/login", setLogin);

authRouter.post("/change-password", authenticate, editPassword);

authRouter.get("/refresh-token", setRefreshToken);

export default authRouter;
