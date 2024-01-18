'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Billimport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Billimport.belongsTo(models.User, { targetKey: 'id', foreignKey: 'uid', as: 'customer' })
      Billimport.hasMany(models.Billdetail, { targetKey: 'id', foreignKey: 'bid', as: 'billDetail' })
    }
  }
  Billimport.init({
    uid: DataTypes.STRING,
    pid : DataTypes.STRING,
    status: {
      type: DataTypes.ENUM,
      values: ['Success', 'Pending', 'Failed']
    },
    reasonCancel: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Billimport',
  });
  return Billimport;
};