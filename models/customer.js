import { Sequelize } from "sequelize";
import sequelize from "../config/db.js";

const customer = sequelize.define(
    "customer",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        customer_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        company_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        address: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        phone_number: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    },
    {
        tableName: "customer",
        underscored: true,
        timestamps: true,
    }
);

// sequelize.sync();

export default customer;
