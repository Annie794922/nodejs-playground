//權限路由的設定

const express = require('express');

const router = express.Router();

router.get('/login', (req, res) => {
    res.status(200) //response
        .render('login', { //(view, {model})
            path: '/login', 
            pageTitle: 'Book Your Books online'});
        // .sendFile(path.join(__dirname, 'views', 'login.html'));
});

router.post('/login', (req, res) => {
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

router.post('/logout', (req, res) => { //處理logout的POST request
    // TODO: 實作logout 機制
    res.redirect('/login');
});

//將上面路由打包成模組
module.exports = router;