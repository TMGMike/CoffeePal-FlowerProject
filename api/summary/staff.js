var express = require('express');
var app = module.exports = express();
var mysql = require('mysql');
var cred = require(`${__dirname}/../../awsdetails`);
var bodyParser = require("body-parser");

app.set('views', `${__dirname}/../../views`);
app.set('view engine', 'pug');

// for parsing application/json
app.use(bodyParser.json());
// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/staff', function (req, res) {

    var conn = mysql.createConnection({
        host      :   cred.DB_HOST,
        user      :   cred.DB_USER,
        password  :   cred.DB_PASS,
        database  :   cred.DB_NAME
    });
    var addressQuery = "INSERT INTO `coffeepal`.`Address` (address_street, address_city, address_postcode) VALUES (?, ?, ?);";
    var addressInserts = [req.body.employee_street, req.body.employee_city, req.body.employee_postcode];

    conn.query(addressQuery, addressInserts, function(err, result) {
        if (err) {
            console.log("Couldn't insert address: ");
            console.log(err);
            res.status(500).json({status_code: 500, error: err});
        } else {
            console.log("Created address");

            var empQuery = "INSERT INTO `coffeepal`.`Employee` (`user_id`, `employee_fname`, `employee_lname`, `employee_nin`, `employee_store_id`, `employee_address_id`) VALUES (?, ?, ?, ?, ?, LAST_INSERT_ID());";
            var inserts = [req.body.employee_id, req.body.employee_first_name, req.body.employee_last_name, req.body.employee_nin, req.body.employee_store_id];

            conn.query(empQuery, inserts, function(empErr, result) {
                if(err) {
                    console.log("Couldn't create employee - ");
                    console.log(empErr);
                    res.render('summary', {errorMessage: empErr.message})
                }
                else {
                    res.render('summary', {created: true});
                }
            });
        }
    });
});

app.get('/api/stores', function(req, res){
    var conn = mysql.createConnection({
        host      :   cred.DB_HOST,
        user      :   cred.DB_USER,
        password  :   cred.DB_PASS,
        database  :   cred.DB_NAME
    });

    var userQuery = "SELECT * FROM `coffeepal`.`Store`;";
    conn.query(userQuery, function(err, result) {
        if(err) {
            console.log(err);
            res.status(500).json({status_code: 500, message: err.message});
        } else {
            res.json({status_code: 200, data: result});
        }
    });
});

app.get('/api/users', function(req, res){
    var conn = mysql.createConnection({
        host      :   cred.DB_HOST,
        user      :   cred.DB_USER,
        password  :   cred.DB_PASS,
        database  :   cred.DB_NAME
    });

    var userQuery = "SELECT * FROM `coffeepal`.`User`;";
    conn.query(userQuery, function(err, result) {
        if(err) {
            console.log(err);
            res.status(500).json({status_code: 500, message: err.message});
        } else {
            var users = [];
            for (var i = 0; i < result.length; i++) {
                var user = {};
                user.user_id = result[i].user_id;
                user.name = result[i].name;
                users.push(user);
            }
            res.json({status_code: 200, data: users});
        }
    });
});