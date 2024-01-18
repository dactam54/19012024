'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Billimports', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      uid: {
        type: Sequelize.STRING
      },
      pid: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM('Success', 'Pending', 'Failed')
      },
      reasonCancel: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Billimports');
  }
};