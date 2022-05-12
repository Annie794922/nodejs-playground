// 第一個區塊 內建模租

// const url = require('url');
const path = require('path');

// 第二個區塊 第三方模組(套件)
const express = require('express');
const bodyParser = require('body-parser'); //POST 過來的 data 需要解析（parse）

// 第三個區塊 自建模組
const products = [
    {
        title: '四月是你的謊言 1',
        price: 80,
        description: '有馬公生的母親一心想把有馬培育成舉世聞名的鋼琴家，而有馬也不負母親的期望，在唸小學時就贏得許多鋼琴比賽的大獎。11歲的秋天，有馬的母親過世，從此他再也聽不見自己彈奏的鋼琴聲，沮喪的他也只好放棄演奏，但在14歲那年，經由兒時玩伴的介紹，有馬認識了小提琴手宮園薰，並被薰的自由奔放吸引，沒想到薰竟開口邀請公生在比賽時擔任她的伴奏…',
        imageUrl: 'https://im2.book.com.tw/image/getImage?i=https://www.books.com.tw/img/001/062/25/0010622563.jpg&v=52dcfd21&w=348&h=348'
    },
    {
        title: '四月是你的謊言 2',
        price: 80,
        description: '公生答應在二次預賽中擔任小薰的鋼琴伴奏。比賽一開始公生還能順利彈琴，但在中途又再次因為聽不見鋼琴的聲音而停手。沒想到小薰也跟著停止演奏、等候公生。原本心灰意冷的公生因此重新振作，與小薰合奏出驚人的樂章…......',
        imageUrl: 'https://im1.book.com.tw/image/getImage?i=https://www.books.com.tw/img/001/062/31/0010623172.jpg&v=52dcfd21&w=348&h=348'
    },
    {
        title: '四月是你的謊言 3',
        price: 80,
        description: '在小薰的逼迫之下，公生不得不參加音樂比賽。為了參加比賽，公生從早到晚不停的練習，但就是無法彈奏出屬於自己的巴哈與蕭邦。此時，公生的面前出現兩位強勁的對手-相座武士與井川繪見，他們曾經是公生的手下敗將，一心想在比賽中擊敗公生雪恥。先上台演奏的武士彈奏出令全場喝采的激昂樂章…',
        imageUrl: 'https://im2.book.com.tw/image/getImage?i=https://www.books.com.tw/img/001/062/76/0010627615.jpg&v=5315ab5f&w=348&h=348'
    },
];

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

app.get('/', (req, res) => { //進入到根目錄時就get資料
    res.status(200)
        .render('index', {
            path: '/', //知道現在是瀏覽哪個頁面
            pageTitle: 'Book Your Books online',
            products: products}); //渲染index這個檔案並將渲染內容命名為pageTitle
        // .sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/login', (req, res) => {
    res.status(200)
        .render('login', {
            path: '/login',
            pageTitle: 'Book Your Books online'});
        // .sendFile(path.join(__dirname, 'views', 'login.html'));
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

app.post('/logout', (req, res) => { //處理logout的POST request
    // TODO: 實作logout 機制
    res.redirect('/login');
});


app.get('*', (req, res) => {
    res.status(404)
        .render('404',  {
            path: '/*',
            pageTitle: 'Page not found'});
        // .sendFile(path.join(__dirname, 'views', '404.html'));
}); //*萬用路由的位置要放在所有路由的最後面，否則會讓所有的路由皆顯示404

app.listen(3000, () => {
	console.log('Web Server is running on port 3000');
});

// const products = []; // 宣告常數 products 同時賦予它 [] 空陣列



