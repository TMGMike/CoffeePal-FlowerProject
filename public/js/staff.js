function getUsers(callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    };
    xmlHttp.open("GET", "http://coffeepal.themadgamers.co.uk/api/users", true); // true for asynchronous

    xmlHttp.send(null);
}

function setUsers() {
    getUsers(function(usersData) {
        var jsonData = JSON.parse(usersData);
        var userDropdown = document.getElementById("employee-list");
        for(var i = 0; i < jsonData.data.length; i++) {
            console.log(`<option value=${jsonData.data[i].user_id}>${jsonData.data[i].name}</option>`);
            userDropdown.innerHTML += `<option value=${jsonData.data[i].user_id}>${jsonData.data[i].user_id} - ${jsonData.data[i].name}</option>`;
        }
    });

    getStores(function(storeData) {
        var jsonData = JSON.parse(storeData);
        var userDropdown = document.getElementById("store-list");
        for(var i = 0; i < jsonData.data.length; i++) {
            console.log(`<option value=${jsonData.data[i].store_id}>${jsonData.data[i].store_name}</option>`);
            userDropdown.innerHTML += `<option value=${jsonData.data[i].store_id}>${jsonData.data[i].store_id} - ${jsonData.data[i].store_name}</option>`;
        }
    });
}

function getStores(callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    };
    xmlHttp.open("GET", "http://localhost:3000/api/stores", true); // true for asynchronous

    xmlHttp.send(null);
}