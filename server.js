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
            res.end(indexHtml);
        } catch(e) {
            res.end(e);
        }
    }

    if ( /^\/public\//.test(pathname) ) {
        let filePath = path.join(__dirname, '/src/', pathname);
        
        try {
            fs.accessSync(filePath, fs.R_OK | fs.W_OK);
            let fileBuffer = fs.readFileSync(filePath)
            let suffix = filePath.match(/\.(.*?)$/)[1];
            let contentType = '';
            switch(suffix) {
                case 'css':
                    contentType = 'text/css';
                    break;
                case 'js':
                    contentType = 'application/x-javascript';
                    break;
                default:
                    contentType = 'text/plain';
            }

            res.writeHead(200, 'ok', {
                'Content-Type': contentType
            });

            res.end(fileBuffer);
        } catch(e) {
            console.log(e)
            res.writeHead(404, 'bad request');
            res.end();
        }
    }
});

server.listen(4001);