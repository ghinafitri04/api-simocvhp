import sequelize from "../config/db.js";
import { Sequelize } from "sequelize";

const letter_type = sequelize.define(
    "letter_type",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        letter_type: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    },
    {
        tableName: "letter_type",
        underscored: true,
        timestamps: true,
    }
);

// sequelize.sync();

export default letter_type;
