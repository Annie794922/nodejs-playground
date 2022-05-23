 // models/cart-item.js
// 新增 CartItem 模型(針對購物車中的每一項商品去賦予key(id、quantity) = 資料庫table的欄位名稱)
// 因為 Cart 與 Product 需要定義一張新的表單來記錄商品數量，因此先來製作 CartItem 模型

 const Sequelize = require('sequelize');

 const database = require('../utils/database');
 
 ////////////////////////////////////////////////////////////
 
 //透過 define，Sequelize 會將物件映射到資料庫建立 cartItems 表單
 const CartItem = database.define('cartItem', {
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
 
 module.exports = CartItem;