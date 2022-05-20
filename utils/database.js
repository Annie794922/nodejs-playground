//連接資料庫的工具

const Sequelize = require('sequelize');
//匯入第三方模組sequelize(在操作 JavaScript 的物件時，同時就增刪改查在資料庫的資料)

////////////////////////////////////////////////////////////

//宣告一個屬性 database，並建立一個 Sequelize 的實例（instance）賦予給它。
const database = new Sequelize('demo', 'root', 'root', { //new 一個class(JS語法)，('資料庫名稱', '資料庫用戶帳號', '資料庫用戶密碼')
    dialect: 'mysql', 
    host: 'localhost'
});
//稍早建的Demo0519只是一個資料庫的入口，真正要連的是側邊的demo資料庫，若node app.js有執行就代表有成功連上資料庫

// Google線上資料庫
// const database = new Sequelize ('demo', 'admin', 'admin', {
// 	dialect: 'mysql',
// 	host: '130.211.120.155'
// });

module.exports = database; 