// models/cart.js
// 新增 Cart 模型

const Sequelize = require('sequelize');

const database = require('../utils/database');

////////////////////////////////////////////////////////////

const Cart = database.define('cart', {
  id: {
    type: Sequelize.INTEGER, //最重要的key值
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
	amount: { //購物車總額
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
});

module.exports = Cart;