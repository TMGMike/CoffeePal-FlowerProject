var express = require("express");
var app = module.exports = express();
var bodyParser = require('body-parser');
var request = require('request');
app.use( bodyParser.json() );

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));

var orders = [{order_id: "d0001", status: "open", "staff_id": "e0001", store_id: "5045", date: 1549554785, products: [{product_id: "p0001", customer_name: "John"}, {product_id: "p0002", customer_name: "Alice"}, {product_id: "p0003", customer_name: "Billy"}]}, {order_id: "d0002", status: "open", "staff_id": "e0002", store_id: "5045", date: 1549554796, products: [{product_id: "p0006", customer_name: "Tony"}]}, {order_id: "d0003", status: "fulfilled", "staff_id": "e0001", store_id: "5045", date: 1549554715, products: [{product_id: "p0003", customer_name: "Andy"}]}];

app.get("/api/orders", function(req, res) {
    // Get all existing orders
    var toReturn = [];
    var availableParams = ["open", "fulfilled", "cancelled", "all"];

    if(availableParams.includes(req.query.status)){
        if(req.query.status === "all") {
            res.json({"status_code": 200, orders: (orders.length > 0) ? orders : null});
        } else {
            for(var i = 0; i < orders.length; i++) {
                if (orders[i].status === req.query.status) {
                    toReturn.push(orders[i]);
                }
            }
            res.json({"status_code": 200, orders: (toReturn.length > 0) ? toReturn : null});
        }

    } else {
        for(var i = 0; i < orders.length; i++) {
            if (orders[i].status === "open") {
                toReturn.push(orders[i]);
            }
        }
        res.json({"status_code": 200, orders: (toReturn.length > 0) ? toReturn : null});
    }
});

app.get("/orders", function(req, res){
    console.log(req.query);
    var options = {
        url: "http://localhost:3000/api/orders?status=all",
        method: "GET"
    };

    request(options, function(error, response, body){
        var bodyJson = JSON.parse(body);

        //  Render the orders view. Send a boolean of whether an order was created, and if it was successful,
        // as well as a JSON object of orders, and a reference to the convertDate function, to dynamically convert
        // any UNIX timestamp to human-readable date format, when it pulls them from the DB.
        res.render('orders', { "created" : req.query["created"], "orders": bodyJson.orders, "conv_date": convertDate });
    });

});

app.get("/api/orders/:orderid", function(req, res){
    for (var i = 0; i < orders.length; i++) {
        if(orders[i].order_id === req.params['orderid']) {
            res.json({"status_code": 200, "order": orders[i]});
        }
    }
});

app.post("/api/orders", function(req, res) {
    console.log(req.body);
    if(req.body["add_to"] === "new") {
        var order = {
            "order_id": (orders.length < 10) ? "d000" + (orders.length + 1) : "d00" + (orders.length + 1),
            "status": "open",
            "paid": (req.body.paid === 'on'),
            "staff_id": "",
            "store_id": "",
            "date": Math.floor(new Date() / 1000),
            "products": [ ],
            "comments": req.body.comments
        };

        order.products.push({product_id: req.body.product, customer_name: req.body.customername, size: req.body.size});
        orders.push(order);
    }
    else {
        for (var i = 0; i < orders.length; i++){
            if(orders[i].order_id === req.body["add_to"]){
                orders[i].products.push({product_id: req.body.product, customer_name: req.body.customername, size: req.body.size});
                break;
            }

        }
    }


    console.log(order);
    res.redirect('/orders?created=success');
});

var convertDate = function(unix) {

    var unixtimestamp = unix;

    var months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    var date = new Date(unixtimestamp*1000);
    var year = date.getFullYear();
    var month = months_arr[date.getMonth()];
    var day = date.getDate();

    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();

    // Display date time in MM-dd-yyyy h:m:s format
    var convdataTime = month+'-'+day+'-'+year+' '+hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

    return convdataTime;
};