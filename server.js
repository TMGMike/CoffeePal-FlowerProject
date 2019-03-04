var express   = require('express');
var port      = process.env.PORT || 3000;
var app       = express(),
path          = require('path'),
publicDir     = path.join(__dirname,'/public');

var bodyParser = require('body-parser');

var swaggerUi = require('swagger-ui-express'),
    swaggerDocumentation = require('./swagger.json');

var coupons   = require('./api/coupons');
var summary   = require('./api/summary');
var orders    = require('./api/orders');
var products  = require('./api/products');
var login     = require('./api/login');
var signup    = require('./api/signup');

app.use(products);
app.use(coupons);
app.use(summary);
app.use(orders);
app.use(login);
app.use(signup);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var swaggerOptions = {
    customCss: '.logo__img {\n' +
        '    background: url(\'http://coffeepal.themadgamers.co.uk/img/CoffeePal.png\') no-repeat;\n' +
        '} \n .swagger-ui .topbar {\n' +
        '    background-color: #b35900;\n' +
        '}\n'
};

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocumentation, swaggerOptions));
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
