import sequelize from "../config/db.js";
import { Sequelize } from "sequelize";
import customer from "./customer.js";
import product from "./product.js";

const customer_detail = sequelize.define(
    "customer_detail",
    {
        product_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
        },
        customer_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
        },
        qty: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: "customer_detail",
        underscored: true,
        timestamps: true,
    }
);

customer_detail.belongsTo(customer, {
    foreignKey: "customer_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
customer.hasMany(customer_detail, {
    foreignKey: "customer_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

customer_detail.belongsTo(product, {
    foreignKey: "product_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
product.hasMany(customer_detail, {
    foreignKey: "product_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

// sequelize.sync();

export default customer_detail;
