'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Varriant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Varriant.init({
    sku: DataTypes.STRING,
    name: DataTypes.TEXT,
    images: {
      type: DataTypes.TEXT,
      set(value) {
        this.setDataValue('images', JSON.stringify(value))
      },
      get() {
        const raw = this.getDataValue('images')
        return raw ? JSON.parse(raw) : null
      }
    },
    price: DataTypes.FLOAT,
    pid: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Varriant',
  });
  return Varriant;
};