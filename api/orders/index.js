var express = require("express");
var app = module.exports = express();

var orders = [{status: "open", "staff_id": "e0001", store_id: "5045", date: 1549554785, products: [{product_id: "p0001", customer_name: "John"}, {product_id: "p0002", customer_name: "Alice"}, {product_id: "p0003", customer_name: "Billy"}]}, {status: "open", "staff_id": "e0002", store_id: "5045", date: 1549554796, products: [{product_id: "p0006", customer_name: "Tony"}]}, {status: "fulfilled", "staff_id": "e0001", store_id: "5045", date: 1549554715, products: [{product_id: "p0003", customer_name: "Andy"}]}];

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

    /*switch (req.query.status) {
        case "open":
            for(var i = 0; i < orders.length; i++) {
                if (orders[i].status === "open") {
                    toReturn.push(orders[i]);
                }
            }
            res.json({"status_code": 200, orders: toReturn});
            break;
        case "fulfilled":
            for(var i = 0; i < orders.length; i++) {
                if (orders[i].status === "fulfilled") {
                    toReturn.push(orders[i]);
                }
            }
            res.json({"status_code": 200, orders: toReturn});
            break;
        case "cancelled":
            for(var i = 0; i < orders.length; i++) {
                if (orders[i].status === "cancelled") {
                    toReturn.push(orders[i]);
                }
            }
            res.json({"status_code": 200, orders: toReturn});
            break;
        case "all":
            res.json({"status_code": 200, orders: orders});
            break;
        default:
            for(var i = 0; i < orders.length; i++) {
                if (orders[i].status === "open") {
                    toReturn.push(orders[i]);
                }
            }
            res.json({"status_code": 200, orders: toReturn});
            break;
    }*/

});

app.get("/api/orders/{orderid}", function(req, res){
    // Get a specific order by id
});

app.post("/api/orders", function(req, res) {
    res.status(201).json(
        {
            "status": 201,
            "message": "Created Order."
        }
    );
});

