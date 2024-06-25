import { Sequelize } from "sequelize";
import sequelize from "../config/db.js";

const product_type = sequelize.define(
    "product_type",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        product_type: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    },
    {
        tableName: "product_type",
        underscored: true,
        timestamps: true,
    }
);

// sequelize.sync();

export default product_type;
