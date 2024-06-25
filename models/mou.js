import { Sequelize } from "sequelize";
import sequelize from "../config/db.js";
import customer from "./customer.js";

const mou = sequelize.define(
  "mou",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    start_date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    finish_date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    mou_file: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    customer_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "mou",
    underscored: true,
    timestamps: true,
    getterMethods: {
      file_url() {
        return `https://api-simocvhp-production.up.railway.app/${this.mou_file}`;
      },
    },
  }
);

mou.belongsTo(customer, {
  foreignKey: "customer_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
customer.hasMany(mou, {
  foreignKey: "customer_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

export default mou;
