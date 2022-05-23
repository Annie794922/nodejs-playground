const express = require('express');

const shopController = require('../controllers/shop');
const isLogin = require('../authGuard/isLogin');

////////////////////////////////////////////////////////////

const router = express.Router();

router.get('/', shopController.getIndex);
// router.get('/product/:id', shopController.getProduct);
router.get('/cart', isLogin, shopController.getCart); //要在有登入(isLogin)狀態下才能拜訪指定頁面(路由守衛)
router.get('/orders', isLogin, shopController.getOrders);
router.post('/cart-add-item', isLogin, shopController.postCartAddItem);
router.post('/cart-delete-item', isLogin, shopController.postCartDeleteItem);
router.post('/create-order', isLogin, shopController.postOrders);

module.exports = router;