import sequelize from "./config/db.js";
import "./models/customer.js";
import "./models/mou.js";
import "./models/customer_detail.js";
import "./models/inspection.js";
import "./models/letter.js";
import "./models/letter_type.js";
import "./models/product.js";
import "./models/product_type.js";
import "./models/user.js";

sequelize.sync();
