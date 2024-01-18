'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      name: { type: Sequelize.STRING },
      thumb: { type: Sequelize.STRING },
      spec_thumb: { type: Sequelize.STRING },
      brand: { type: Sequelize.STRING },
      policy: { type: Sequelize.TEXT('long') },
      detail: { type: Sequelize.TEXT('long') },
      overviews: { type: Sequelize.TEXT('long') },
      images: { type: Sequelize.TEXT('long') },
      catalog: { type: Sequelize.STRING },
      catalogslug: { type: Sequelize.STRING },
      views: { type: Sequelize.INTEGER, defaultValue: 0 },
      discount: { type: Sequelize.INTEGER, defaultValue: 0 },
      quantity: { type: Sequelize.INTEGER, defaultValue: 0 },
      star: { type: Sequelize.INTEGER, defaultValue: 0 },
      desc: { type: Sequelize.TEXT('long') },
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
    await queryInterface.dropTable('Products');
  }
};