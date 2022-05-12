// 第一個區塊 內建模租

// const url = require('url');
const path = require('path');

// 第二個區塊 第三方模組(套件)
const express = require('express');
const bodyParser = require('body-parser'); //POST 過來的 data 需要解析（parse）

// 第三個區塊 自建模組


////////////////////////////////////////////////////////////

const app = express();

// middleware(介於客戶端和瀏覽器之間的處理，決定要以什麼方式進行溝通--ex. 處理授權)
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

app.get('/', (req, res) => {
    res.status(200)
        .sendFile(path.join(__dirname, 'views', 'index.html')); //(專案資料夾, 被讀取檔案所在的資料夾, 被讀取的檔案)
});

app.get('/login', (req, res) => {
    res.status(200)
        .sendFile(path.join(__dirname, 'views', 'login.html')); //(專案資料夾, 被讀取檔案所在的資料夾, 被讀取的檔案)
});

app.get('/login', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
        res.redirect('/');
    } else {
        console.log('欄位尚未填寫完成')
    }
    console.log('Form email: ', email);
    console.log('Form password: ', password);
    // console.log('Form data: ', req.body);
    //後台顯示輸入的資料內容(login輸入欄位設定的name值會被帶到頁面上顯示)
});

app.get('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
}); //*萬用路由的位置要放在所有路由的最後面，否則會讓所有的路由皆顯示404

app.listen(3000, () => {
	console.log('Web Server is running on port 3000');
});