var express = require("express");
var app     = module.exports = express();
app.set('views', `${__dirname}/../../views`);

var AmazonCognitoIdentity = require("amazon-cognito-identity-js");
// var cred = require(`${__dirname}/../../awsdetails`);
var bodyParser = require("body-parser");
app.set('view engine', 'pug');

// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/signup', function(req, res) {
   // res.render("login");
    var err = false;
    if (req.query.err === "true") {
        err = true;
    }
    res.render("signup", {
        loginError: err
    });
});

var pool = {
  UserPoolId :  process.env.PoolID,
  ClientId   :  process.env.AppClient
};

app.post('/signup', function(req,res) {

    console.log("Creating user: ");
    console.log(req.body);

    if(req.body.password[0] !== req.body.password[1]) {
        console.log("Passwords did not match for user: ");
        console.log(req.body);

        res.render("signup", {
            loginError   :  true,
            loginEmail   :  req.body.email,
            loginMessage :  "Please ensure your passwords match."
        });
    }else {

        var dataEmail = {
            Name  :  'email',
            Value :  req.body.email
        };
        var dataBirthday = {
            Name  :  'birthdate',
            Value :  `${req.body.year}-${req.body.month}-${req.body.day}`
        };
        var dataName = {
            Name  :  'name',
            Value :  req.body.name
        };
        var dataPhone = {
            Name  :  'phone_number',
            Value :  req.body.phone_number
        };

        console.log(`Using date for user:
         Name: ${dataName.Value}
         Birthdate: ${dataBirthday.Value}
         Phone Number: ${dataPhone.Value}
         Email: ${dataEmail.Value}`);

        var attributeList  = [];
        var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
        var attributeBirth = new AmazonCognitoIdentity.CognitoUserAttribute(dataBirthday);
        var attributePhone = new AmazonCognitoIdentity.CognitoUserAttribute(dataPhone);
        var attributeName  = new AmazonCognitoIdentity.CognitoUserAttribute(dataName);

        attributeList.push(attributeEmail);
        attributeList.push(attributeBirth);
        attributeList.push(attributePhone);
        attributeList.push(attributeName);

        var userPool = new AmazonCognitoIdentity.CognitoUserPool(pool);

        userPool.signUp(dataEmail.Value, req.body.password[0], attributeList, null, function(err, result) {
           if(err) {
               console.log("Couldn't sign user up: ");
               console.log(err);

               res.render("signup", {
                   loginError   :  true,
                   loginEmail   :  req.body.email,
                   loginMessage :  "There was an internal error signing up.",
                   rawError     :  err.message
               });
           }
           else {
               var cognitoUser = result.user;
               console.log("Successfully created user '" + cognitoUser + "' :");
               console.log(result);
               res.json({message: "Created account", statusCode: "201"});
           }
        });
    }
    /*try {

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

       // cognitoUser.setAuthenticationFlowType("USER_PASSWORD_AUTH");

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
    }*/
});