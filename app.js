// 第一個區塊 內建模租

// const url = require('url');
const path = require('path');

// 第二個區塊 第三方模組(套件)
const express = require('express');
const bodyParser = require('body-parser'); //POST 過來的 data 需要解析（parse）

// 第三個區塊 自建模組
const authRoutes = require('./routes/auth'); //引入自建的權限路由模組
const shopRoutes = require('./routes/shop'); 
const errorRoutes = require('./routes/404');

////////////////////////////////////////////////////////////

const app = express();

// middleware(介於客戶端和瀏覽器之間的處理，決定要以什麼方式進行溝通--ex. 處理授權)
app.set('view engine', 'ejs');
app.set('views', 'views');
// 預設路徑就是 views，如果沒有變動，可以省略此設定(第一個views資料夾放在第二個views裡)

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false })); //不要強化版的url加密

app.use((req, res, next) => {
    console.log('Hello!');
    next(); //若沒加next，程式會不知道何時該結束，加了之後middleware才會以use.use.get的順序執行
})
app.use((req, res, next) => {
    console.log('World!');
    next();
})

app.use(authRoutes); //套用auth.js裡面的權限路由
app.use(shopRoutes);
app.use(errorRoutes);

app.listen(3000, () => {
	console.log('Web Server is running on port 3000');
});

// const products = []; // 宣告常數 products 同時賦予它 [] 空陣列



