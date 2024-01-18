'use strict';
const {
  Model
} = require('sequelize');
const { formatVietnameseToString } = require('../ultils/fn')
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.hasMany(models.Varriant, { foreignKey: 'pid', as: 'variants' })
      Product.hasMany(models.Vote, { foreignKey: 'pid', as: 'votes' })
      Product.hasMany(models.Comment, { foreignKey: 'pid', as: 'comments' })
      Product.hasMany(models.Bipro, { foreignKey: 'pid', as: 'boughtProducts' })
      // Product.hasMany(models.Bipro, { foreignKey: 'pid', as: 'boughtProducts' })
    }
  }
  Product.init({
    name: DataTypes.STRING,
    thumb: DataTypes.STRING,
    spec_thumb: DataTypes.STRING,
    brand: DataTypes.STRING,
    policy: {
      type: DataTypes.TEXT,
      set(value) {
        this.setDataValue('policy', JSON.stringify(value))
      },
      get() {
        const raw = this.getDataValue('policy')
        return raw ? JSON.parse(raw) : null
      }
    },
    detail: {
      type: DataTypes.TEXT,
      set(value) {
        this.setDataValue('detail', JSON.stringify(value))
      },
      get() {
        const raw = this.getDataValue('detail')
        return raw ? JSON.parse(raw) : null
      }
    },
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
    overviews: {
      type: DataTypes.TEXT,
      set(value) {
        this.setDataValue('overviews', JSON.stringify(value))
      },
      get() {
        const raw = this.getDataValue('overviews')
        return raw ? JSON.parse(raw) : null
      }
    },
    catalog: DataTypes.STRING,
    views: DataTypes.INTEGER,
    catalogslug: {
      type: DataTypes.STRING,
      set(value) {
        this.setDataValue('catalogslug', formatVietnameseToString(value))
      }
    },
    discount: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    star: DataTypes.INTEGER,
    desc: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};