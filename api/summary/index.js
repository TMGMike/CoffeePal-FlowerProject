var express = require("express");
var app = module.exports = express();
app.set('views', __dirname);

app.set('view engine', 'pug');

app.get("/summary", function(req, res){
    // Return ?user= value from URL, or "Guest" if not provided.
    if(req.query.user !== undefined && req.query.user !== ""){
        var username = req.query.user;
    } else { username = "Guest" }

    res.render("form",
        {
            user: username
        }
    );
});

