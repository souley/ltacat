"use strict";

let express = require('express'),
    compression = require('compression'),
    products = require('./server/products'),
    database = require('./server/database.js'),
    app = express();

  try {
    console.log('Initializing database module');
    database.initialize(); 
  } catch (err) {
    console.error(err); 
    process.exit(1); // Non-zero failure code
  }

app.set('port', process.env.PORT || 5000);

app.use(compression());

app.use('/', express.static(__dirname + '/www'));


// Adding CORS support
app.all('*', function (req, res, next) {
    // Set CORS headers: allow all origins, methods, and headers: you may want to lock this down in a production environment
    res.header("Access-Control-Allow-Origin", "*");
    //res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    res.header("Access-Control-Allow-Methods", "GET");
    res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));

    if (req.method === 'OPTIONS') {
        // CORS Preflight
        res.send();
    } else {
        next();
    }
});

app.get('/products', products.findAll);
app.get('/product/:lid', products.findByProdId);

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
