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

export default route;
