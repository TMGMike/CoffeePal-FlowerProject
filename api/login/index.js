var express = require("express");
var app     = module.exports = express();
app.set('views', `${__dirname}/../../views`);
// require('node-fetch');
var AmazonCognitoIdentity = require("amazon-cognito-identity-js");
// var cred = require(`${__dirname}/../../awsdetails`);
var bodyParser = require("body-parser");
app.set('view engine', 'pug');

// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/login', function(req, res) {
   // res.render("login");
    var err = false;
    if (req.query.err === "true") {
        err = true;
    }
    res.render("login", {
        loginError: err
    });
});

var pool = {
  UserPoolId :  process.env.PoolID,
  ClientId   :  process.env.AppClient
};

app.post('/login', function(req,res) {

    console.log("Verifying user " + req.body);
    console.log(req.body);
    try {

        var userPool = new AmazonCognitoIdentity.CognitoUserPool(pool);


        var userData = {
            Username: req.body.email,
            Pool: userPool
        };

        var authenticationData = {
            Email: req.body.email,
            Password: req.body.password
        };

        var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

       cognitoUser.setAuthenticationFlowType("USER_PASSWORD_AUTH");

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                console.log("User was successfully authenticated: " + result);
                res.redirect("summary");
            },
            onFailure: function (err) {
                console.log("User could not be authenticated. - " + err);
                res.render("login", {
                    loginError: true,
                    loginEmail: req.body.email
                });
            },
            mfaRequired: function (codeDeliveryDetails) {
                // TODO: Implement MFA here
            }
        });

    } catch(err){
        console.log("Encountered error " + err);

        res.render("login", {
            loginError: true,
            loginEmail: req.body.email
        });
    }
});