'use strict';
const { Model } = require('sequelize');
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // User.belongsTo(models.Produc)
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      set(value) {
        const salt = bcrypt.genSaltSync(10)
        this.setDataValue('password', bcrypt.hashSync(value, salt))
        // return 
      }
    },
    cart: {
      type: DataTypes.TEXT,
      set(pids) {
        if (pids) {
          this.setDataValue('cart', JSON.stringify(pids))
        } else {
          this.setDataValue('cart', null)
        }
      },
      get() {
        const rawValue = this.getDataValue('cart')
        return rawValue ? JSON.parse(rawValue) : null
      }
    },
    address: DataTypes.STRING,
    wishlist: {
      type: DataTypes.TEXT,
      set(pids) {
        this.setDataValue('wishlist', JSON.stringify(pids))
      },
      get() {
        const rawValue = this.getDataValue('wishlist')
        return rawValue ? JSON.parse(rawValue) : null
      }
    },
    role: {
      type: DataTypes.ENUM,
      values: ['admin', 'user']
    },
    passwordResetToken: {
      type: DataTypes.STRING,
      set(value) {
        if (!value) {
          this.setDataValue('passwordResetToken', '')
        } else {
          const hashedToken = crypto.createHash('sha256').update(value).digest('hex')
          this.setDataValue('passwordResetToken', hashedToken)
        }
      }
    },
    passwordTokenExpiry: DataTypes.DATE,
    phone: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};