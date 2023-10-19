var bodyParser = require('body-parser')
const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');

const app = express();

const privateKey = fs.readFileSync('./privkey1.pem', 'utf8');
const certificate = fs.readFileSync('./cert1.pem', 'utf8');
const ca = fs.readFileSync('./chain1.pem', 'utf8');


const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};


app.use(express.json({limit: '100mb', extended: true}));
app.use(bodyParser.json({limit: '100mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', '*');
    next();
}
//USE
app.use(allowCrossDomain);

const ControllerFind       = require('./controllers/ReqControllerFind');

app.get('/invoices/:cpf/:codigo',           ControllerFind.invoices)
app.post('/demo',                           ControllerFind.demo)


//END
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(8090, () => {
	console.log('HTTP Server running on port 8090');
});

httpsServer.listen(8089, () => {
	console.log('HTTPS Server running on port 8089');
});