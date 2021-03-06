//重構MVC架構是為了關注點分離(出錯時可以找到問題點)

//負責權限路由的控制功能

const bcryptjs = require('bcryptjs');

const User = require('../models/user');

const getLogin = (req, res) => {
    const errorMessage = req.flash('errorMessage')[0]; //常數參數errorMessage為req.flash裡面的errorMessage陣列中的第一筆資料
    res.status(200) //將views/auth/login的表單裡輸入的資料渲染過來
        .render('auth/login', { //(view, {model})
            path: '/login', //若app.js的檔案中寫了res.locals.path = req.url;，這一行就要註解掉(否則是重複定義)
            pageTitle: 'Login',
            errorMessage
        });
}

const getSignup = (req, res) => {
    const errorMessage = req.flash('errorMessage')[0];
    res.status(200)
        .render('auth/signup', { //因在app.js中寫了app.set('views', 'views'); [告知views在views資料夾裡面]，因此路徑不用再特地寫前面的views
            pageTitle: 'Signup',
            errorMessage
        });
}

const postLogin = (req, res) => {
    const { email, password } = req.body; //接收到使用者輸入的資料為email和password

    // 去後端比對user是否真的存在
    User.findOne({ where: { email }}) //查詢使用者輸入的其中一個資料為email
    .then((user) => {
        if (!user) { //當輸入的email不是資料庫裡的user資料時(和資料庫的user比對不一致)
            req.flash('errorMessage', '錯誤的 Email 或 Password。'); //請求的request裡面的flash有個參數[名稱為errorMessage]，裡面的資訊為"錯誤的 Email 或 Password。"
            return res.redirect('/login');
        }
        bcryptjs //只能比對資料庫中已經加密過的資料
        .compare(password, user.password) //比對輸入的密碼&資料庫裡的密碼資料是否一致
        .then((isMatch) => {
            if (isMatch) {
                req.session.user = user; //把 User 資料儲存到 session 中
                req.session.isLogin = true;
                return req.session.save((err) => { //req.session.save()--沒使用的話session不會儲存在Node.js中
                    console.log('postLogin - save session error: ', err);
                    res.redirect('/');
                });
            }
            req.flash('errorMessage', '錯誤的 Email 或 Password。')
            res.redirect('/login');
        })
        .catch((err) => {
            return res.redirect('/login');
        })
    })
        //    密碼尚未加密的函式檢核寫法
    //     if (user.password === password) { //核對user資料表的密碼和輸入的密碼是否一致
    //         console.log('login: 成功');
    //         req.session.isLogin = true; //req.session(express內建的寫法)讓資料成為全域變數，isLogin是自訂的參數名稱
    //         return res.redirect('/') //若登入成功就導到根目錄
    //     } 
    //     // console.log('login: 找不到此 user 或密碼錯誤'); //上面資料都不符合時這裡的程式就會執行
    //     req.flash('errorMessage', '錯誤的 Email 或 Password。');
    //     res.redirect('/login');
    // })

    .catch((err) => {
        console.log('login error:', err);
    });

}

const postSignup = (req, res) => { //創建帳號的同時新增一台專屬的購物車
    const { displayName, email, password } = req.body;
    User.findOne({ where: { email } })
        .then((user) => {
            if (user) {
                req.flash('errorMessage', '此帳號已存在！請使用其他 Email。')
                return res.redirect('/signup');
            } else {
                return bcryptjs.hash(password, 12)
                    .then((hashedPassword) => {
                        return User
                            .create({ displayName, email, password: hashedPassword })
                            .then((newUser) => {
                                return newUser.createCart();
                                //由於已經在app.js定義User和Cart的關係，因此可以透過ORM去對新使用者創建一台購物車
                            })
                            .catch((err) => {
                                console.log('postSignup - newUser.carateCart error: ', err);
                            });
                    })
                    .catch((err) => {
                        console.log('create new user error: ', err);
                    })
            }
        })
        .then((result) => {
            res.redirect('/login');
        })
        .catch((err) => {
            console.log('signup_error', err);
        });
};

const postLogout = (req, res) => {
    req.session.destroy((err) => { //函式接受到err參數時就執行毀滅session的程式(登出時會從API接收到err的訊息)
        console.log('session destroy() error: ', err);
        res.redirect('/login');
    });
};

module.exports = { //將上面路由打包成模組
    getLogin,
    getSignup,
    postLogin,
    postLogout,
    postSignup,
}; 