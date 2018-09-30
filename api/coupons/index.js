
var express = require("express");

var app = module.exports = express();

var coupons = {
    "coupons": [
        {
            "expires_in": "3600",
            "issue_id": "xmas2017",
            "valid_store": 5045
        },
        {
            "expires_in": "3600",
            "issue_id": "xmas2018",
            "valid_store": 3150
        },
        {
            "expires_in": "3600",
            "issue_id": "october2018",
            "valid_store": 8403
        },
        {
            "expires_in": "3600",
            "issue_id": "blackfriday2018",
            "valid_store": 5045
        },
    ]
};
app.get("/api/coupons", function(req, res){
    res.status(200).json(coupons);
});