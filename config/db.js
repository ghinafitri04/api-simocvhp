import { Sequelize } from "sequelize";
import "dotenv/config";

const options = {
  logging:
    process.env.NODE_ENV === "development"
      ? (...msg) => console.log(msg)
      : false,
  dialectOptions: {
    requestTimeout: 30000,
    encrypt: true,
    useUTC: false,
    dateStrings: true,
    typeCast(field, next) {
      if (field.type === "DATETIME") {
        return field.string();
      }
      return next();
    },
  },
  timezone: "+07.00",
  insecureAuth: true,
};

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, options)
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT,
        ...options,
      }
    );

export default sequelize;
