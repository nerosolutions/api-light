const express = require('express');
const app = express();
var bodyParser = require('body-parser')


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

// ROUTE
app.get('/c/:cpf/:codigo',                  ControllerFind.invoices)


//END
const PORT = process.env.PORT || 8089;
app.listen(PORT, ()=>{
    console.log('rodando na porta '+PORT);
});
