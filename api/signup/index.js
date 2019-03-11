var express = require("express");
var app     = module.exports = express();
var crypto  = require('crypto');
var mysql   = require('mysql');
var bodyParser = require("body-parser");
var requestIp = require('request-ip');
var cred = require(`${__dirname}/../../awsdetails`);

app.set('views', `${__dirname}/../../views`);
app.set('view engine', 'pug');

app.use(requestIp.mw());

// for parsing application/json
app.use(bodyParser.json());
// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/signup', function(req, res) {
   // res.render("login");
    console.log("Traffic from: " + req.clientIp);
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


// 2019-04-02 03:35:19
app.post('/signupl', function(req,res) {

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

        var dataEmail = req.body.email;

        var dataBirthday = `${req.body.year}-${req.body.month}-${req.body.day}`;
        var dataName = req.body.name;
        var dataPhone = req.body.phone_number;

        console.log(`Using date for user:
         Name: ${dataName}
         Birthdate: ${dataBirthday}
         Phone Number: ${dataPhone}
         Email: ${dataEmail}`);

        const salt = crypto.randomBytes(64).toString('hex');
        console.log("Generated salt: " + salt);

        crypto.pbkdf2(req.body.password[0], salt, 10000, 64, 'sha512', (err, key) => {
            if(err) {
                console.log("Couldn't sign user up: ");
                console.log(err);

                res.render("signup", {
                    loginError   :  true,
                    loginEmail   :  req.body.email,
                    loginMessage :  "There was an internal error signing up.",
                    rawError     :  err.message
                });
            } else {
                console.log("Created hash: " + key.toString('hex'));

                var connection = mysql.createConnection({
                    host      :   cred.DB_HOST,
                    user      :   cred.DB_USER,
                    password  :   cred.DB_PASS,
                    database  :   cred.DB_NAME
                });

                connection.connect();
                // INSERT INTO `coffeepal`.`User` (`name`, `email`, `password`, `user_dob`, `phone_number`) VALUES
                // ('Mike', 'madmike1011@hotmail.', 'QEWFR$%3', '1998-04-02', '01925565604');
                var sql = "INSERT INTO `coffeepal`.`User` (`name`, `email`, `password`, `user_dob`, `phone_number`, `salt`) VALUES (?, ?, ?, ?, ?, ?)";
                var inserts = [dataName, dataEmail, req.body.password[0], dataBirthday, dataPhone, salt];

                connection.query(sql, inserts, function(err, result) {
                    if(err){
                        console.log("Couldn't sign user up: ");
                        console.log(err);

                        res.render("signup", {
                            loginError   :  true,
                            loginEmail   :  req.body.email,
                            loginMessage :  "There was an internal error signing up.",
                            rawError     :  err.message
                        });
                    } else {
                        console.log(`Created user '${dataEmail}':`);
                        console.log(result);

                        // TODO Create token here and save to browser cache.
                        // Token should be a combination of email and login date/time
                        // E.g. token = hash value of "john@example.com+1549554785
                        var tokenData = `${dataEmail}+${Math.floor(new Date() / 1000)}`;
                        var token = crypto.createHash('md5').update(tokenData).digest('hex');
                        // Write token to DB

                        var tokenQuery = "INSERT INTO `coffeepal`.`SessionToken` (`user_id`, `token`, `created_from`) VALUES ('1', 'test123', '86.123.73.98');";
                        var tokenInserts = ['id', token];

                        res.render("signup", {
                            session_token : token
                        });
                    }
                });
            }
        });

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