const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
    console.log('服务已启动，端口4001')
});

server.on('request', (req, res) => {
    console.log(req);
});

server.listen(4001);