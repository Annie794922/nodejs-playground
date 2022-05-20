//權限路由的設定(重構MVC架構)

const express = require('express');

const authController = require('../controllers/auth');

////////////////////////////////////////////////////////////

const router = express.Router();

router.get('/login', authController.getLogin); //從controllers的auth引入函式

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);

router.post('/logout', authController.postLogout);

//將上面路由打包成模組
module.exports = router;