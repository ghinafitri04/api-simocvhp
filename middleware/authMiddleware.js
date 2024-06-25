// const { verifyAccessToken } = require("../utils/jwt");
import { verifyAccessToken } from "../utils/jwt.js";

const auth = (requiredRoles) => {
    return (req, res, next) => {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                errors: ["Token not found"],
                message: "Verify Field",
                data: null,
            });
        }
        const user = verifyAccessToken(token);
        if (!user) {
            return res.status(401).json({
                errors: ["Invalid token"],
                message: "Verify Field",
                data: null,
            });
        }

        // Check if user role is allowed
        if (!requiredRoles.includes(user.role)) {
            return res.status(403).json({
                errors: ["Unauthorized access"],
                message: "Forbidden",
                data: null,
            });
        }

        req.user = user;
        next();
    };
};

const authenticate = auth(["admin", "operasional", "karyawan"]);
const authAdmin = auth(["admin"]);
const authOperasional = auth(["admin", "operasional"]);
const authKaryawan = auth(["karyawan"]);

export { authenticate, authAdmin, authOperasional, authKaryawan };

//https://194.233.77.161/movie/missing-2023-gi4dcnzq/play/
