var express = require('express');
var port = process.env.PORT || 3000;
var app = express(),
path = require('path'),
publicDir = path.join(__dirname,'public');

var coupons = require("./api/coupons");
var summary = require("./api/summary");

app.use(coupons);
app.use(summary);
app.use(express.static(publicDir));

app.listen(port);
console.log("Running server...");
module.exports = app;
