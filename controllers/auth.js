//重構MVC架構是為了關注點分離(出錯時可以找到問題點)

//負責權限路由的控制功能

const User = require('../models/user');

const getLogin = (req, res) => {
    res.status(200) //將views/auth/login的表單裡輸入的資料渲染過來
        .render('auth/login', { //(view, {model})
            path: '/login', //若app.js的檔案中寫了res.locals.path = req.url;，這一行就要註解掉(否則是重複定義)
            pageTitle: 'Login'});
        // .sendFile(path.join(__dirname, 'views', 'login.html'));
}

const postLogin = (req, res) => {
    const { email, password } = req.body; //接收到使用者輸入的資料為email和password
    // const { email, password } = {email: '1@1', password: '11111111'} (結構賦值)
    // {email: '1@1', password: '11111111'}

    User.findOne({ where: { email }}) //查詢使用者輸入的其中一個資料為email
    .then((user) => { //將上一行查詢的資料(email)命名為user
        if (!user) { //當輸入的email不是資料庫裡的user資料時
            console.log('login: 找不到此 user 或密碼錯誤');
            return res.redirect('/login');
        }
        if (user.password === password) { //核對user資料表的密碼和輸入的密碼是否一致
            console.log('login: 成功');
            req.session.isLogin = true; //req.session(express內建的寫法)讓資料成為全域變數，isLogin是自訂的參數名稱
            return res.redirect('/') //若登入成功就導到根目錄
        } 
        console.log('login: 找不到此 user 或密碼錯誤'); //上面資料都不符合時這裡的程式就會執行
        res.redirect('/login');
    })
    .catch((err) => { //找不到資料不等於出錯，出錯通常會是資料庫問題之類的
        console.log('login error:', err);
    });

}

const postLogout = (req, res) => { 
    res.redirect('/login');
}

module.exports = { //將上面路由打包成模組
    getLogin,
    postLogin,
    postLogout,
}; 