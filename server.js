var express = require('express');
var port = process.env.PORT || 3000;

var app = express(),
path = require('path'),
publicDir = path.join(__dirname,'/public');

//var swaggerUi = require('swagger-ui-express'),
 //   swaggerDocumentation = require('./swagger.json');
var coupons = require('./api/coupons');
var summary = require('./api/summary');
var orders = require('./api/orders');
var products = require('./api/products');

app.use(products);
app.use(coupons);
app.use(summary);
app.use(orders);
//app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocumentation));
app.use(express.static(publicDir));
app.set('views', `${__dirname}/views`);

app.set('view engine', 'pug');
app.listen(port, function () {
    console.log("Server running on " + port);
});

app.get("/about", function(req, res){
    res.render("about");
});

module.exports = app;
