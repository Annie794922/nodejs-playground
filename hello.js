// hello.js
const title = 'I am Hello Module';

const sayHello = () => {
    console.log('Hello!');
};

const sayGoodnight = () => {
    console.log('Good night!');
};

// module.exports.say = sayHello; //要匯出上面的sayHello並且命名成say

// module.exports = { //物件模組
//     say: sayHello,
//     sayGoodnight: sayGoodnight,
//     title: 'I am Hello Module'; //hello的title資料
// };

//JS remarks: (在JS中當key和value一樣的時候，可以縮寫成以下寫法)
//老師較推薦第三種寫法
module.exports = {
    sayHello, // = sayhello: sayHello,
    sayGoodnight,
    title, //hello的title資料
};