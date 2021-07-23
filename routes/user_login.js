var express = require('express');
var user = express.Router();

user.get('/login', function (req, res) {
    const {name,password} = req.body;
    var sql = `SELECT * from user_logs WHERE user_name = ? and password = ?`;

    db.query(sql, [name, password], (err, data) => {
    
        if (err) {
            console.log("===err1===", err);
        } else {
            if (data.length === 0) {
                console.log("user does not exist");
                res.json(data);
            }
            else {
                console.log("login successfully");
                res.json(data);
            }
        }
    });
});



module.exports = user;