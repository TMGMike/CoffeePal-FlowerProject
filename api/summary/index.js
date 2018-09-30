var express = require("express");

var app = module.exports = express();

app.set('views', __dirname);
app.set('view engine', 'pug');

app.get("/summary", function(req, res){
    res.render("form");
});