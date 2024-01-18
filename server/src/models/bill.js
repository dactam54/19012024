'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bill extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Bill.belongsTo(models.User, { targetKey: 'id', foreignKey: 'uid', as: 'customer' })
      Bill.hasMany(models.Bipro, { targetKey: 'id', foreignKey: 'bid', as: 'billDetails' })
      Bill.belongsTo(models.Coupon, { targetKey: 'id', foreignKey: 'coupon', as: 'selectedCoupon' })
    }
  }
  Bill.init({
    uid: DataTypes.STRING,
    total: DataTypes.INTEGER,
    status: {
      type: DataTypes.ENUM,
      values: ['Success', 'Pending', 'Failed']
    },
    // type: {
    //   type: DataTypes.ENUM,
    //   values: ['Import', 'Export']
    // },
    coupon: DataTypes.INTEGER,
    isChecked: DataTypes.BOOLEAN,
    reasonCancel: DataTypes.TEXT

  }, {
    sequelize,
    modelName: 'Bill',
  });
  return Bill;
};