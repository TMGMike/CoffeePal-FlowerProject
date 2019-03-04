var ordersOnLoad = function() {

    getProductsAsync(function (productData) {
        var data = JSON.parse(productData);

        var dropdown = document.getElementById("select-orders");

        data.products.sort(compare);
        for(var i = 0; i < data.products.length; i++) {

            console.log(`<option value=${data.products[i].id}>${data.products[i].name}</option>`);
            dropdown.innerHTML += `<option value=${data.products[i].id}>${data.products[i].name}</option>`

        }

        console.log("setting names");
        setProductName();
    });
    getOrdersAsync(function(ordersData) {
        var data = JSON.parse(ordersData);
    });

};

function compare(a,b) {
    if (a.name < b.name)
        return -1;
    if (a.name > b.name)
        return 1;
    return 0;
}

function getOrdersAsync(callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    };
    xmlHttp.open("GET", "http://localhost:3000/api/orders?status=all", true); // true for asynchronous

    xmlHttp.send(null);
}

function getProductsAsync(callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    };
    xmlHttp.open("GET", "http://localhost:3000/api/products", true); // true for asynchronous

    xmlHttp.send(null);
}

function setProductName() {
    getProductsAsync(function(data) {
        var jsonData = JSON.parse(data);
        console.log(jsonData);

        // Loop through the products, and find any HTML tag with the product ID inside its ID tag.
        for (var i = 0; i < jsonData.products.length; i++) {
            var element = document.getElementById("prod-" + jsonData.products[i].id);

            // If there is an element with that product ID, append the product name to the HTML tag.
            if(element !== null && element !== undefined) {
                element.innerHTML = jsonData.products[i].name + element.innerHTML;

                // Change the tag to -done, so that it isn't recognised a second time to avoid infinite loops.
                element.id += "-done";

                // Restart the loop for any other products with that product ID.
                i = 0;
            }
        }

        var orderArea = document.getElementById("order-area");
        var table = document.getElementById("order-table");
        orderArea.style.height = (table.clientHeight) * 1.1;
    });
}
