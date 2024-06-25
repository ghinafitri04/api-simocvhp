import { Sequelize } from "sequelize";
import sequelize from "../config/db.js";
import product_type from "./product_type.js";

const product = sequelize.define(
    "product",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        product_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        product_stock: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        product_type_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: "product",
        underscored: true,
        timestamps: true,
    }
);

product.belongsTo(product_type, {
    foreignKey: "product_type_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

product_type.hasMany(product, {
    foreignKey: "product_type_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

// sequelize.sync();

export default product;
