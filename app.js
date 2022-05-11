// console.log('Hello world!');

// 第一個區塊 內建模租

const path = require('path'); //引入hello.js這支檔案
const http = require('http');

// 第二個區塊 第三方模組(套件)

// 第三個區塊 自建模組
const hello = require('./hello');

////////////////////////////////////////////////////////////////


hello.sayHello(); //在hello這支檔案執行say這個方法

console.log(hello.title);