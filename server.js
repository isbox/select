const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    console.log('服务已启动，端口4001')
});

server.on('request', (req, res) => {
    let {pathname} = url.parse(req.url);
    if ( pathname === '' || pathname === '/' ) {
        res.writeHead(200, 'ok', {
            'Content-Type': 'text/html'
        })
        try {
            let indexHtml = fs.readFileSync(path.join(__dirname, '/src/template/index.html'));   
            console.log(indexHtml)
            res.end(indexHtml);
        } catch(e) {
            res.end(e);
        }
    }

    if ( /^\/public\//.test(pathname) ) {
        let file = path.join(__dirname, pathname);
        let live = null;
        try {
            console.log(fs.accessSync(file, fs.F_OK))
            live = fs.accessSync(file, fs.F_OK);
            console.log(live)
        } catch(e) {}

        if ( live ) {
            res.writeHead(200, 'ok');
        } else {
            res.writeHead(404, 'bad request');
        }
    }
});

server.listen(4001);