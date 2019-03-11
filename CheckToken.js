var mysql = require('mysql');
var cred = require('./awsdetails');

module.exports = {
    test: function() {
        var connection = mysql.createConnection({
            connectionLimit: 100,
            host      :   cred.DB_HOST,
            port: 3306,
            user      :   cred.DB_USER,
            password  :   cred.DB_PASS,
            database  :   cred.DB_NAME
        });

        connection.connect();
        var sql = "SELECT * FROM USER";
        connection.query(sql, function(err, result){
            console.log(err);
            console.log(result);
        });
    },
    checkToken: function(token, callback) {
        var connection = mysql.createConnection({
            host      :   cred.DB_HOST,
            user      :   cred.DB_USER,
            password  :   cred.DB_PASS,
            database  :   cred.DB_NAME
        });
        connection.connect(function(err) {
            if (err) throw err;

            var sql = "SELECT * FROM SessionToken st WHERE st.token = ?;";
            var inserts = [token];
            connection.query(sql, inserts,function(err, result, fields) {
                if(err) {
                    console.log("Encountered error checking token: " + err);
                    return null;
                }else {
                    if(result.isNotEmpty) {
                        console.log(result[0].token);
                        var empSql = "SELECT * FROM Employee WHERE user_id = ?";
                        var empInserts = [result[0].user_id];

                        // Connect to the Employee database and check if a user exists.
                        connection.query(empSql, empInserts, function(empErr, empResults) {
                            // Check if a user was returned. If not, they are not an employee, skip checking for manager.
                            if(empResults.isNotEmpty){
                                var managerSql = "SELECT * FROM Manager WHERE manager_id = ?";

                                connection.query(managerSql, empInserts, function(manErr, manResults) {
                                    if(manErr) callback(null);
                                    if(manResults.isNotEmpty) {
                                        // User is a manager.
                                        callback({token: result[0].token, user_id: result[0].user_id, role: "manager"});
                                    }
                                    else {
                                        // User is not a manager, return employee.
                                        callback({token: result[0].token, user_id: result[0].user_id, role: "employee"});
                                    }
                                });
                            } else {
                                // User is not an employee, return standard user.
                                callback(
                                    {
                                        token: result[0].token,
                                        user_id: result[0].user_id,
                                        role: "user"
                                    });
                            }
                        });

                    } else {
                        callback(null);
                    }
                }
            });
        });
    }
};