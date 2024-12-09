const http = require('http');
require('dotenv').config();
const port = process.env.PORT;
const router = require('./routes');

console.log('Server is started');

http.createServer(function(req, res) {
	router({ req, res });
}).listen(port);