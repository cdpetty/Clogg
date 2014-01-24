var httpProxy = require('http-proxy');

var proxy = httpProxy.createProxyServer({target:'http://localhost:3000'}).listen(80);