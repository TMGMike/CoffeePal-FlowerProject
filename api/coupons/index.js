
var express = require("express");
var app     = module.exports = express();

var coupons = {
    "coupons": [
        {
            "expires_in": 172800,
            "coupon_code": "coffee20",
            "valid_store": 5045,
            "data": {
                "coupon_type": "discount",
                "coupon_value": 20,
                "required_products": [],
                "minimum_spend": 30
            }
        },
        {
            "expires_in": 202800,
            "coupon_code": "xmas18",
            "valid_store": 3150,
            "data": {
                "coupon_type": "free_product",
                "coupon_value": "p0001",
                "required_products": [
                    "p0003",
                    "p0006"
                ],
                "minimum_spend": 0
            }
        },
        {
            "expires_in": 3000,
            "coupon_code": "october18",
            "valid_store": 5045,
            "data": {
                "coupon_type": "discount",
                "coupon_value": 30,
                "required_products": [
                    "p0005"
                ],
                "minimum_spend": 25
            }
        }
    ]
};
/**
 * Get all of the current coupons.
 * @module /api/coupons
 * @function
 * @return {undefined}
 */

app.get("/api/coupons", function(req, res){
    res.status(200).json(coupons);
});