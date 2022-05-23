//連接資料庫的工具

const Sequelize = require('sequelize');
//匯入第三方模組sequelize(在操作 JavaScript 的物件時，同時就增刪改查在資料庫的資料)

////////////////////////////////////////////////////////////

const database = new Sequelize('demo', 'root', 'root', { //new 一個class(JS語法)，('資料庫名稱', '資料庫用戶帳號', '資料庫用戶密碼')
    dialect: 'mysql', 
    host: 'localhost'
});


// Google線上資料庫
// const database = new Sequelize ('demo', 'admin', 'admin', {
// 	dialect: 'mysql',
// 	host: '130.211.120.155'
// });

module.exports = database; 