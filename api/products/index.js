var express = require("express");
var app     = module.exports = express();
app.set('views', `${__dirname}/../../views`);

app.set('view engine', 'pug');

var products = {
    "products": [
        {
            "id": "p0001",
            "name": "Flat White",
            prices: {
                "small" : 2.30,
                "medium": 2.60,
                "large" : 3.20
            }
        },
        {
            "id": "p0002",
            "name": "Americano",
            prices: {
                "small" : 2.50,
                "medium": 2.80,
                "large" : 3.30
            }
        },
        {
            "id": "p0003",
            "name": "Mocha",
            prices: {
                "small" : 2.30,
                "medium": 2.60,
                "large" : 3.20
            }
        },
        {
            "id": "p0004",
            "name": "Latte",
            prices: {
                "small" : 2.30,
                "medium": 2.60,
                "large" : 3.20
            }
        },
        {
            "id": "p0005",
            "name": "English Breakfast Tea",
            prices: {
                "small" : 2.10,
                "medium": 2.50,
                "large" : 3.00
            }
        },
        {
            "id": "p0006",
            "name": "Espresso",
            prices: {
                "small" : 2.30,
                "medium": 2.60,
                "large" : 3.20
            }
        },
        {
            "id": "p0007",
            "name": "Latte Macchiato",
            prices: {
                "small" : 2.30,
                "medium": 2.60,
                "large" : 3.20
            }
        },
        {
            "id": "p0008",
            "name": "Caramel Macchiato",
            prices: {
                "small" : 2.30,
                "medium": 2.60,
                "large" : 3.20
            }
        },
        {
            "id": "p0009",
            "name": "Hot Chocolate",
            prices: {
                "small" : 2.50,
                "medium": 2.80,
                "large" : 3.00
            }
        },
        {
            "id": "p0010",
            "name": "Caramel Hot Chocolate",
            prices: {
                "small" : 2.65,
                "medium": 2.90,
                "large" : 3.10
            }
        },
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
    var selectedProduct = null;

    for (var i = 0; i < products.products.length; i++){
        if(products.products[i].id === req.params['productid']){
            selectedProduct = products.products[i];
            break;
        }
    }
    (selectedProduct !== null) ? res.status(200).json({"status_code": 200, "data": products.products[i]}) :
        res.status(404).json({"status_code": 404, "message": `Could not find product '${req.params['productid']}'`});


    // res.render("products", product);
});
