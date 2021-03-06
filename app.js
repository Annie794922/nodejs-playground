// 第一個區塊 內建模租

// const url = require('url');
const path = require('path');

// 第二個區塊 第三方模組(套件)
const express = require('express');
const session = require('express-session');
const connectFlash = require('connect-flash');
const csrfProtection = require('csurf'); //針對 csrf 攻擊的保護機制
const bodyParser = require('body-parser'); //POST 過來的 data 需要解析（parse）

// 第三個區塊 自建模組
const database = require('./utils/database');
const authRoutes = require('./routes/auth'); //引入自建的權限路由模組
const shopRoutes = require('./routes/shop'); 
const errorRoutes = require('./routes/404');
const Product = require('./models/product'); //將models/product裡面的Product實例內容帶過來
const User = require('./models/user');
const bcryptjs = require('bcryptjs');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-items');
const Order = require('./models/order');
const OrderItem = require('./models/order-items');

////////////////////////////////////////////////////////////

const app = express();
const port = 3000;
const oneDay = 1000 * 60 * 60 * 24;

// middleware
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false })); //不要強化版的url加密(解析POST的URL)
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ 
	secret: 'sessionToken',  // 加密用的字串(字串內的字可自行決定)
	resave: false,   // 沒變更內容是否強制回存
	saveUninitialized: false ,  // 新 session 未變更內容是否儲存
	cookie: {
		maxAge: oneDay // session 狀態儲存多久？單位為毫秒(10000毫秒 = 10秒)
	}
})); 


app.use(connectFlash());
app.use(csrfProtection());

// NOTE: 自定義模組取得 User model (如果已登入的話) [從controllers/auth.js取得session.user]
app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findByPk(req.session.user.id) //Pk = Primary key
        .then((user) => {
            req.user = user;
            next();
        })
        .catch((err) => {
            console.log('find user by session id error: ', err);
        })
});

app.use((req, res, next) => {
    res.locals.path = req.url;
    res.locals.pageTitle = 'Book Your Books online';
    res.locals.isLogin = req.session.isLogin || false;
    res.locals.csrfToken = req.csrfToken();
    next(); //若沒加next，程式會不知道何時該結束，加了之後middleware才會以use.use.get的順序執行
});

app.use(authRoutes);
app.use(shopRoutes);
app.use(errorRoutes);

//定義 User 與 Cart 的關係
User.hasOne(Cart); //一個 User 擁有一個 Cart
Cart.belongsTo(User); //一個 Cart 屬於一個 User

//Cart 與 Product 的關聯
//一個 Cart 屬於多個 Product，而一個 Product 也屬於多個 Cart(同個購物車可以放多項不同商品，同個商品會被選進不同購物車)
//他們之間需要一張表單來記錄商品數量
Cart.belongsToMany(Product, { through: CartItem }); //後面的through--透過CartItem去記錄前面兩者的關係
Product.belongsToMany(Cart, { through: CartItem });

//定義 User 與 Order 的關係
Order.belongsTo(User); //一個 Order 屬於 一個 User
User.hasMany(Order); //User 擁有多個 Order
Order.belongsToMany(Product, { through: OrderItem }); //一個 Order 屬於多個 Product，他們之間需要一張表單 orderItems 來記錄商品數量


database
    // .sync()
	.sync({ force: true }) // 同步(傳送force: true的物件--重設還原資料庫)

    // 調整測試資料(自動建立 Admin 使用者時，使用 bcryptjs 套件將密碼加密，使其能夠在進行 login 登入成功)
    .then((result) => {
    const password = '11111111';
    return bcryptjs.hash(password, 12)
        .catch((err) => {
            console.log('create new user hashed Password Error:', err)
        });
    })
    .then((hashedPassword) => {
        User.create({ displayName: 'Admin', email: 'admin@skoob.com', password: hashedPassword })
        Product.bulkCreate(products);
		app.listen(port, () => {
			console.log('Web Server is running on port ${port}'); //${port}是jQuery的寫法
		});
	})
    /////////////////////////////////////////
	.catch((err) => {
		console.log('create web server error: ', err);
	});



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

