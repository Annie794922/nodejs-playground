// 第一個區塊 內建模租

const http = require('http');

// 第二個區塊 第三方模組(套件)

// 第三個區塊 自建模組


////////////////////////////////////////////////////////////

const server = http.createServer((req, res) => {
	// console.log('第一個參數是瀏覽器對 web server 的 request', req);
	// console.log('第二個參數是 web 要response 給瀏覽器的內容', res);
    console.log('req url:', req.url);

    // if (req.url === '/login') {
    //     res.stautsCode = 200; //server回應給瀏覽器的結果
    //     return res.end('This is home page');
    // } 

    if (req.url === '/login') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        return res.end('<h1>This is home page</h1>'); //return 一旦處理好就不再執行
    } 

    // if (req.url === '/login') {
    //     return res.end('This is home page');
    // }
	// res.end(); //告訴程式讀取結束
});

server.listen(3000, () => {
	console.log('running server on port 3000');
});