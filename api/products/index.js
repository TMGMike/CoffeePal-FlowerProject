var express = require("express");
var app     = module.exports = express();
app.set('views', `${__dirname}/../../views`);

app.set('view engine', 'pug');

var products = {
    "products": [
    {
        "id": "p0001",
        "name": "a type of coffee",
        prices: {
            "small" : 2.30,
            "medium": 2.60,
            "large" : 3.20
        }
    },
    {
        "id": "p0002",
        "name": "another type of coffee",
        prices: {
            "small" : 2.50,
            "medium": 2.80,
            "large" : 3.30
        }
    },
    {
        "id": "p0003",
        "name": "another other type of coffee",
        prices: {
            "small" : 2.30,
            "medium": 2.60,
            "large" : 3.20
        }
    },
    {
        "id": "p0004",
        "name": "A terrible coffee",
        prices: {
            "small" : 2.30,
            "medium": 2.60,
            "large" : 3.20
        }
    },
    {
        "id": "p0005",
        "name": "Tea",
        prices: {
            "small" : 2.10,
            "medium": 2.50,
            "large" : 3.00
        }
    }
]
};

app.get("/api/products", function (req, res) {
    res.status(200).json(products);
});

app.get("/products", function(req, res) {
    // Get an all existent orders
    res.render("products", products);
});

/**
 * Get a specific product by ID.
 */
app.get("/api/products/:productid", function(req, res){
    // Get a specific order by id
  //  res.send("Test with product id: " + req.param("productid"));
    var product = {
        "product": {
            "id": req.param("productid"),
            "name": "test"
        }
    };
    res.render("products", product);
});
