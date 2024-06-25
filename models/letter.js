import { Sequelize } from "sequelize";
import sequelize from "../config/db.js";
import letter_type from "./letter_type.js";
import user from "./user.js";

const letter = sequelize.define(
    "letter",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        letter_files: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        status: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        tittle: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        letter_type_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        user_id: {
            type: Sequelize.UUID,
            allowNull: false,
        },
        tanggal_pengajuan: {
            type: Sequelize.DATE,
            allowNull: false,
        },
    },
    {
        tableName: "letter",
        underscored: true,
        timestamps: true,
        getterMethods: {
            file_url() {
                return `http://localhost:3000/${this.letter_files}`;
            },
        },
    }
);

letter.belongsTo(letter_type, {
    foreignKey: "letter_type_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
letter_type.hasMany(letter, {
    foreignKey: "letter_type_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
letter.belongsTo(user, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
user.hasMany(letter, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
// sequelize.sync();

export default letter;
