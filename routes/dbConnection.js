
var sql = require('mysql');

var dbConnection = sql.createConnection({
    host : "localhost",
    password : "",
    user : "root",
    database : "user"
  });

  dbConnection.connect(function(err){
    if(err){
      console.log(err);
    }else{
      console.log("database connected");
    }
  });

module.exports = dbConnection;