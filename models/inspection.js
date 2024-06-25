import { Sequelize } from "sequelize";
import sequelize from "../config/db.js";
import user from "./user.js";
import customer from "./customer.js";

const inspection = sequelize.define(
    "inspection",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        user_id: {
            type: Sequelize.UUID,
            allowNull: false,
        },
        customer_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        description: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        inspection_date: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        status: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    },
    {
        tableName: "inspection",
        underscored: true,
        timestamps: true,
    }
);

inspection.belongsTo(customer, {
    foreignKey: "customer_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
customer.hasMany(inspection, {
    foreignKey: "customer_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

inspection.belongsTo(user, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
user.hasMany(inspection, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

// sequelize.sync();

export default inspection;
