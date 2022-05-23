const Product = require("../models/product");

const getIndex = (req, res) => { //進入到根目錄時就get資料
    Product.findAll() //取得所有 Products 的 Table 的資料
        .then((products) => { //將取得的資料給予參數名稱為products
            res.status(200)
                .render('index', { //利用Product.findAll()將資料庫中的所有資料抓出來，即可將下方的測試資料移除
                    path: '/', //知道現在是瀏覽哪個頁面
                    products // = products: products
                });
            })
            .catch((err) => {
                console.log('Product.findAll() error: ', err);
        })
};

//使用 shop的cart.ejs 模板
const getCart = (req, res) => {
    req.user //從session.user裡面取得的資料
        .getCart() //取得購物車資料
        .then((cart) => {
            return cart.getProducts() //看購物車裡面是否有商品：有的話就回傳商品資料，沒有就回傳空陣列
                .then((products) => {
                    res.render('shop/cart', { //將取得資料渲染到shop的cart.ejs檔案中
                        amount:  cart.amount, //cart資料表裡面的amount
                        products // products: products 或 products: []
                    });
                })
                .catch((err) => {
                    console.log('getCart - cart.getProducts error: ', err);
                })
        })
        .catch((err) => {
            console.log('getCart - user.getCart error', err);
        })
}

//從signup.ejs接收到的只是單純的資料，必須經過body-parser解析才能轉變成一組user資料的模組
//getCart、getProducts、addProduct 等都是ORM所提供的函式(因在app.js已透過CartItem紀錄關係，因此程式知道可以這樣使用)
const postCartAddItem = (req, res) => { //加進購物車的商品資訊
    const { productId } = req.body; //從views/auth/signup.ejs接收到的表單資料(POST request)中取出裡面的productId
    let userCart; //預設值(要讓下面函式都能抓到此作用域，因此放在這裡)
    let newQuantity = 1; //預設值
    req.user //從users資料庫中找出發出request的user及相關資訊
        .getCart() //到carts資料庫裡面核對此user的購物車是否已經有加入此商品(取得購物車資料)
        .then((cart) => {
            userCart = cart; //前面取得的購物車資料
            // NOTE: 檢查 product 是否已在 cart
            return cart.getProducts({ where: { id: productId }}); //依據購物車中商品資料的productId去抓出那一組商品資料
        })
        .then((products) => { //products = 前面透過productId抓取出的那些商品資料
            let product;
            if (products.length > 0) {
                // NOTE: 本來購物車就有的商品，所以數量必定大於 1
                product = products[0]; //product = 購物車中的第一筆資料(index為0)
                const oldQuantity = product.cartItem.quantity;
                //由於在app.js中透過CartItem去記錄關係，因此在product之下有cartItem(會依cart-items.js中的key抓取cartItems資料庫的資訊)
                newQuantity = oldQuantity + 1; //新數量 = 選擇商品的原數量 + 1
                return product; //被加入購物車的那樣商品
            }
            return Product.findByPk(productId); //依上面的商品對應的productId抓出被加入購物車的那樣商品
            //findByPk方法--使用提供的主鍵從資料表中僅獲得一個項目
        })
        .then((product) => {
            return userCart.addProduct(product, { //在現有購物車依前面的productId所屬的商品增加新數量
                through: { quantity: newQuantity } //cartItems資料表中的quantity欄位
            });
        })
        // NOT: 下面這段在處理 amount 總額
        .then(() => {
            return userCart.getProducts(); //在加入新商品之後的購物車取得裡面的所有商品
        })
        .then((products) => {
            const productsSums = products.map((product) => product.price * product.cartItem.quantity);
            //map重組物件(product = Products資料庫中的price * cartItems資料庫中紀錄被丟進購物車中的商品數量(quantity))
            const amount = productsSums.reduce((accumulator, currentValue) => accumulator + currentValue); //詳細請見下方的陣列累加
            userCart.amount = amount; //購物車所有商品的總金額 = 上面用陣列累加算出的總和(amount)

            // Array.reduce() - 陣列累加(最終回傳一個值，下方為舉例) 
            // const numberList = [1,2,3,4];
            // const numberAmount = productsSums.reduce((accumulator, currentValue) => accumulator + currentValue);
            // // 第1次: (0, 1) => 0 + 1 (累積值+目前值)
            // // 2: (1, 2) => 1 + 2
            // // 3: (3, 3) => 3 + 3
            // // 4: (6 + 4) => 6 + 4

            return userCart.save(); //save 創建記錄(可以自行定義模型的實例)
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch((err) => {
            console.log('postCartAddItem error: ', err);
        })
};

const postCartDeleteItem = (req, res, next) => { //移除購物車內的商品
    const { productId } = req.body;
    let userCart;
    req.user
        .getCart() //取得購物車內容
        .then((cart) => { //依productId取得購物車內的商品資料
            userCart = cart;
            return cart.getProducts({ where: { id: productId }});
        })
        .then((products) => { //刪除購物車內的選定商品(毀滅指定product的cartItem)
            const product = products[0]; //接收前面傳來的所有購物車商品資料，並以陣列存取裡面的key(資料表的table)

            //const宣告的常數是物件或陣列類型時，這個識別名稱的參照是唯讀的(read-only)，並不代表這個參照指定到的值是不可改變的
            //參照類型的值，裡面的值是可以作改變的
            return product.cartItem.destroy(); //destroy 透過索引刪除紀錄(可以直接調用)
        })
        .then(() => {
            return userCart
                .getProducts() //取得移除商品之後的最新購物車內容
                .then((products) => { //加總更新購物車內容之後的總金額
                    if (products.length) { //當刪除購物車商品之後還有剩下其他商品時
                        const productSums = products.map((product) => product.price * product.cartItem.quantity);
                        const amount = productSums.reduce((accumulator, currentValue) => accumulator + currentValue); //加總剩下商品的總金額
                        userCart.amount = amount;
                        return userCart.save();
                    }
                });
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch((err) => console.log(err));
};

// const products = [
//     {
//         title: '四月是你的謊言 1',
//         price: 80,
//         description: '有馬公生的母親一心想把有馬培育成舉世聞名的鋼琴家，而有馬也不負母親的期望，在唸小學時就贏得許多鋼琴比賽的大獎。11歲的秋天，有馬的母親過世，從此他再也聽不見自己彈奏的鋼琴聲，沮喪的他也只好放棄演奏，但在14歲那年，經由兒時玩伴的介紹，有馬認識了小提琴手宮園薰，並被薰的自由奔放吸引，沒想到薰竟開口邀請公生在比賽時擔任她的伴奏…',
//         imageUrl: 'https://im2.book.com.tw/image/getImage?i=https://www.books.com.tw/img/001/062/25/0010622563.jpg&v=52dcfd21&w=348&h=348'
//     },
//     {
//         title: '四月是你的謊言 2',
//         price: 80,
//         description: '公生答應在二次預賽中擔任小薰的鋼琴伴奏。比賽一開始公生還能順利彈琴，但在中途又再次因為聽不見鋼琴的聲音而停手。沒想到小薰也跟著停止演奏、等候公生。原本心灰意冷的公生因此重新振作，與小薰合奏出驚人的樂章…......',
//         imageUrl: 'https://im1.book.com.tw/image/getImage?i=https://www.books.com.tw/img/001/062/31/0010623172.jpg&v=52dcfd21&w=348&h=348'
//     },
//     {
//         title: '四月是你的謊言 3',
//         price: 80,
//         description: '在小薰的逼迫之下，公生不得不參加音樂比賽。為了參加比賽，公生從早到晚不停的練習，但就是無法彈奏出屬於自己的巴哈與蕭邦。此時，公生的面前出現兩位強勁的對手-相座武士與井川繪見，他們曾經是公生的手下敗將，一心想在比賽中擊敗公生雪恥。先上台演奏的武士彈奏出令全場喝采的激昂樂章…',
//         imageUrl: 'https://im2.book.com.tw/image/getImage?i=https://www.books.com.tw/img/001/062/76/0010627615.jpg&v=5315ab5f&w=348&h=348'
//     },
// ];

module.exports = { //將上面路由打包成模組
    getIndex,
    getCart,
    postCartAddItem,
    postCartDeleteItem,
}; 