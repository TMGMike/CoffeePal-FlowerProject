var express = require("express");
var app = module.exports = express();

app.get("/api/orders", function(req, res) {
    // Get an all existent orders
    res.send("Test");
});

app.get("/api/orders/{orderid}", function(req, res){
    // Get a specific order by id
});

app.post("/api/orders", function(req, res) {
    // Create a new order
});

