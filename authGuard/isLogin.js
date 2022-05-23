//路由守衛(若沒有在登入狀態下拜訪頁面時，就會被導回指定路徑)

module.exports = (req, res, next) => {
    if (!req.session.isLogin) {
        return res.redirect('/login');
    }
    next();
}