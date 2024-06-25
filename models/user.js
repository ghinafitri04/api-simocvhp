import { Sequelize } from "sequelize";
import sequelize from "../config/db.js";

const user = sequelize.define(
    "user",
    {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        user_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        position: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        role: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        birth_date: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        join_date: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        phone_number: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        address: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    },
    {
        tableName: "user",
        underscored: true,
        timestamps: true,
    }
);

// sequelize.sync();

export default user;
