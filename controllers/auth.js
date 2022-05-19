//重構MVC架構是為了關注點分離(出錯時可以找到問題點)

//負責權限路由的控制功能

const getLogin = (req, res) => {
    res.status(200) //將views/auth/login的表單裡輸入的資料渲染過來
        .render('auth/login', { //(view, {model})
            path: '/login', 
            pageTitle: 'Book Your Books online'});
        // .sendFile(path.join(__dirname, 'views', 'login.html'));
}

const postLogin = (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
        res.redirect('/');
    } else {
        console.log('欄位尚未填寫完成')
    }
    console.log('Form email: ', email);
    console.log('Form password: ', password);
}

const postLogout = (req, res) => { 
    res.redirect('/login');
}

module.exports = { //將上面路由打包成模組
    getLogin,
    postLogin,
    postLogout,
}; 