const http = require('http');
const url = require('url');
const util = require('util');
const path = require("path");
const fs = require('fs');
const qs = require('querystring');
const cookie = require('cookie');
const fn = require('./public');
const events = require('events');
const emitter = new events.EventEmitter();

emitter.setMaxListeners(0)

function server() {
    http.createServer((req, res) => {
        let urlData = url.parse(req.url, true),
            reqModuleName = path.join('/www/html',urlData.pathname);

            fn.log(reqModuleName);
            folder_exists = fs.existsSync(reqModuleName);

        process.on("uncatchException", e => {
            fn.log(e);
            process.exit(1);
        });

        if (req.method == 'GET') {
            if (folder_exists) return fn.toMoudle(reqModuleName, urlData.query, res, req)
            res.statusCode=404;
            res.end();
        } else if (req.method == 'POST') {
            let post = '';
            if (folder_exists) {
                if (urlData.pathname !== '/api/module/uploadimg') {
                    req.on('data', chunk => {
                        post += chunk;
                    });
                    req.on('end', () => {
                        post = qs.parse(post);
                        fn.toMoudle(reqModuleName, post, res, req)
                    });
                } else {
                    fn.uploadimg(req, res, reqModuleName, urlData)
                }

            } else {
                res.statusCode=404;
                res.end()
            }
        };
    }).listen(3000);
    fn.log('node server is start...')
}





module.exports= server;
