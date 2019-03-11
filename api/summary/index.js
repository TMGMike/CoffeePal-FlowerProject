var express = require("express");
var app = module.exports = express();
var morgan = require("morgan");
var request = require("request");
var token = require(`${__dirname}/../../CheckToken`);
var cred = require(`${__dirname}/../../awsdetails`);
var mysql = require('mysql');

app.use(morgan("combined"));
app.set('views', `${__dirname}/../../views`);

app.set('view engine', 'pug');

var getCoupons = function(callback){
    var options = {
        url: "http://coffeepal.themadgamers.co.uk/api/coupons",
        method: "GET"
    };
  request(options, function (error, response, body) {
      console.log("Errors occurred: " + error);
      console.log("Status code: " + response && response.statusCode);
      console.log("Body: " + body);

      var bodyJson = JSON.parse(body);
      var coupons = bodyJson.coupons;
      return callback(coupons);
  });
};

var hasQuery = function(toCheck, callback) {
    // If toCheck is null, there is no query and false should be returned.
    return callback((toCheck !== undefined || toCheck !== ""));
};

app.get("/summary", function(req, res){

    token.checkToken("test", function(result){
        console.log("Token data: ");
        console.log(result);
        if(result !== null) {

        }
    });
    // Return ?user= value from URL, or "Guest" if not provided.
    getCoupons(function (couponsCall) {
        res.render("summary",
            {
                user: (req.query.user !== undefined && req.query.user !== "") ? req.query.user : "Guest",
                coupons: couponsCall,
                store: req.query.store
            }
        );
    });
});

