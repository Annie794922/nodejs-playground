// 第一個區塊 內建模租

// const url = require('url');
const path = require('path');

// 第二個區塊 第三方模組(套件)
const express = require('express');

// 第三個區塊 自建模組


////////////////////////////////////////////////////////////

const app = express();

// middleware(介於客戶端和瀏覽器之間的處理，決定要以什麼方式進行溝通--ex. 處理授權)
app.use((req, res, next) => {
    console.log('Hello!');
    next(); //若沒加next，程式會不知道何時該結束，加了之後middleware才會以use.use.get的順序執行
})
app.use((req, res, next) => {
    console.log('World!');
    next();
})

// app.get('/', (req, res) => { //處理路由(原生寫法)，有人請求get的時候要做的事情(若沒有這段瀏覽器會不知道如何處理get)
//     res.writeHead(200, { 'Content-Type': 'text/html' });
//     res.write('<head><meta charset="utf-8" /></head>')
//     res.write('<body>')
//     res.write('<h1>這是首頁</h1>')
//     res.write('</body>')
// });

app.get('/', (req, res) => {
    // res.writeHead(200, { 'Content-Type': 'text/html' });
    // res.write('<head><meta charset="utf-8" /></head>')
    // res.write('<body>')
    // res.write('<h1>這是首頁</h1>')

    //express寫法(status(200)讀取成功，並直接將檔案送出給瀏覽器)
    res.status(200)
        .sendFile(path.join(__dirname, 'views', 'index.html')); //(專案資料夾, 被讀取檔案所在的資料夾, 被讀取的檔案)
});

app.listen(3000, () => {
	console.log('Web Server is running on port 3000');
});