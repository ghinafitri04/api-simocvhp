"use strict";

const { where } = require("sequelize");
const user = require("../models/user");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // try {
    //   await user.findOrCreate({
    //     where: {
    //       username: "admin",
    //       password: "admin",
    //       user_name: "Admin",
    //       position: "admin sistem",
    //       role: "admin",
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //     default: {
    //       username: "admin",
    //       password: "admin",
    //       user_name: "Admin",
    //       position: "admin sistem",
    //       role: "admin",
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //   });
    // } catch (error) {
    //   console.log(error);
    // }
    await queryInterface.bulkInsert("users", [
      {
        id: "550e8400-e29b-41d4-a716-446655440000",
        username: "admin",
        password:
          "$2a$12$ZPEtjRKN0M6PtaVA0JRFkexwkjLtrzv2xCPyjUA9AYUCQaapjg2y.",
        user_name: "Admin",
        position: "admin sistem",
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
