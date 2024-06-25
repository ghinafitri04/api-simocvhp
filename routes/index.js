import { fileURLToPath } from "url";
import authRouter from "./auth.js";
import customerRouter from "./customer.js";
import customerDetailsRouter from "./customerDetails.js";
import dashRouter from "./dahboard.js";
import inspectionRouter from "./inspection.js";
import letterRouter from "./letter.js";
import letterTypeRouter from "./letterType.js";
import mouRouter from "./mou.js";
import productRouter from "./product.js";
import productTypeRouter from "./productType.js";
import userRouter from "./user.js";
import express from "express";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const route = express.Router();

route.use("/api", authRouter);
route.use("/api", letterTypeRouter);
route.use("/api", productTypeRouter);
route.use("/api", customerRouter);
route.use("/api", customerDetailsRouter);
route.use("/api", inspectionRouter);
route.use("/api", letterRouter);
route.use("/api", mouRouter);
route.use("/api", productRouter);
route.use("/api", userRouter);
route.use("/api", authRouter);
route.use("/api", dashRouter);

route.get("/assets/mou/:filename", (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, "assets/mou", filename);
    res.sendFile(filePath);
});

export default route;
