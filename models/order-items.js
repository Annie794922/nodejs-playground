 // models/order-item.js (新增 OrderItem 模型)
//就像 Cart 與 Product 之間需要透過 CartItem 來記錄關係資料（數量）
//Order 與 Product 也需要 OrderItem 來記錄數量

 const Sequelize = require('sequelize');

 const database = require('../utils/database');
 
 const OrderItem = database.define('orderItem', {
   id: {
     type: Sequelize.INTEGER,
     autoIncrement: true,
     allowNull: false,
     primaryKey: true
   },
     quantity: {
     type: Sequelize.INTEGER,
     allowNull: false,
     defaultValue: 0
   }
 });
 
 module.exports = OrderItem;