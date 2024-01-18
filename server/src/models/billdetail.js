'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Billdetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Billdetail.belongsTo(models.Product, { targetKey: 'id', foreignKey: 'pid', as: 'products' })
    }
  }
  Billdetail.init({
    pid: DataTypes.STRING,
    bid: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    preQuantity : DataTypes.INTEGER,
    price: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Billdetail',
  });
  return Billdetail;
};