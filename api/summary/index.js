var express = require("express");
var app = module.exports = express();
var morgan = require("morgan");
var request = require("request");

app.use(morgan("combined"));
app.set('views', `${__dirname}\\..\\..\\views`);

app.set('view engine', 'pug');

var getCoupons = function(callback){
    var options = {
        url: "http://coffeepal-floweapp.m9ncewxn3n.eu-west-2.elasticbeanstalk.com/api/coupons",
        method: "GET"
    };
  request(options, function (error, response, body) {
      console.log("Errors occurred: " + error);
      console.log("Status code: " + response && response.statusCode);
      console.log("Body: " + body);

      var bodyJson = JSON.parse(body);
      var coupons = bodyJson.coupons;
      return callback(coupons);
  })
};

var hasQuery = function(toCheck, callback) {
    if(toCheck === undefined || toCheck === ""){
        return callback(false);
    }else {
        return callback(true);
    }
};

app.get("/summary", function(req, res){
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

