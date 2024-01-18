'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bipro extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Bipro.belongsTo(models.Product, { targetKey: 'id', foreignKey: 'pid', as: 'products' })
      Bipro.belongsTo(models.Bill, { targetKey: 'id', foreignKey: 'bid', as: 'billdata' })
    }
  }
  Bipro.init({
    pid: DataTypes.STRING,
    bid: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    
    price: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Bipro',
  });
  return Bipro;
};