var express = require('express');
var user = express.Router();

//  user registration
user.post('/', function (req, res) {
    const { firstname, lastname, email, password, gender, rolls } = req.body;
    var hobbies = req.body.hobbies;
    var sql1 = `SELECT * from users WHERE email = ?`;
    db.query(sql1, [email], function (err, result) {
        // let headers = new Headers();
        // headers.append('Access-Control-Allow-Origin', '*');
        // headers.append('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        // headers.append('Access-Control-Allow-Headers','Content-Type, Authorization');
        // res.setHeader(headers);
        if (err) {
            res.send({
                "message": err.message,
                "status": 0,
                "code": res.statusCode,
                "data": req.body
            })
        } else {
            if (result.length === 0) {
                var sql2 = `INSERT INTO users (firstname, lastname, email, password, gender, role_id) VALUES (?,?,?,?,?,?)`;
                db.query(sql2, [firstname, lastname, email, password, gender, rolls], function (err, data) {
                    if (err) {
                        res.send({
                            "message": err.message,
                            "status": 0,
                            "code": res.statusCode,
                            "data": req.body
                        })
                    };

                    for (let i = 0; i < hobbies.length; i++) {
                        var hobbie_id = hobbies[i];
                        var sql3 = `INSERT INTO user_hobbies (user_id, hobbie_id) SELECT users.id, hobbies.id FROM users, hobbies 
                                    WHERE users.email= ? AND hobbies.id = ?`;
                        db.query(sql3, [email, hobbie_id], function (err, data) {
                            if (err) { res.send({ "message": err.message }) };
                        })
                    }
                    console.log("user register successfully");
                    res.send({
                        "message": "register successfully",
                        "status": 1,
                        "code": res.statusCode,
                        "data": req.body
                    });
                })
            }
            else {
                console.log("user already exists");
                res.send({
                    "message": "user already exists",
                    "status": 1,
                    "code": res.statusCode,
                    "data": result
                });
            }
        }
    })
})

// get user list
user.get('/', function (req, res) {
    // var sql = `SELECT users.*, (SELECT GROUP_CONCAT(user_hobbies.hobbie_id) FROM user_hobbies WHERE user_hobbies.user_id = users.id) AS hobbies FROM users;`;
    // var sql1 = ` SELECT user_id,
    //                 GROUP_CONCAT(DISTINCT hobbie_id
    //                             ORDER BY hobbie_id DESC SEPARATOR ', ') AS hobbies
    //             FROM user_hobbies
    //             GROUP BY user_id`;
    // var sql2 = `SELECT users.*, user_hobbies.hobbie_id FROM users LEFT JOIN user_hobbies ON users.id = user_hobbies.user_id ORDER BY users.id`;
    var sql3 = `SELECT users.*, h.hobbies FROM users
                LEFT JOIN (SELECT user_id,
                                    GROUP_CONCAT(DISTINCT hobbie_id
                                                ORDER BY hobbie_id DESC SEPARATOR ', ') AS hobbies
                                FROM user_hobbies
                                GROUP BY user_id) as h
                ON users.id = h.user_id`;
    db.query(sql3, function (err, data) {
        if (err) {
            res.send({
                "message": err.message,
                "status": 0,
                "code": res.statusCode,
                "data": data
            })
        } else {
            res.json({
                "message": "list of users",
                "status": 1,
                "code": res.statusCode,
                "data": data
            });
        }
    })
})

// get user by id
user.get('/:id', function (req, res) {
    var user_id = req.params.id;
    const sql1 = `SELECT hobbie_id FROM user_hobbies WHERE user_id = ?`;
    // const sql2 = `SELECT * FROM users join user_hobbies on user_hobbies.user_id = users.id where user_hobbies.user_id = ?`;
    const sql3 = `SELECT * FROM users WHERE id = ?`;
    db.query(sql3, [user_id], (err, data) => {
        if (err) {
            res.send({
                "message": err.message,
                "status": 0,
                "code": res.statusCode,
                "data": data
            })
        } else {
            db.query(sql1, [user_id], (err, hobbiedata) => {
                if (err) {
                    res.send({
                        "message": err.message,
                        "status": 0,
                        "code": res.statusCode,
                        "data": data
                    })
                } else {
                    data.map(o => (o.hobbies = hobbiedata))
                    res.json({
                        "message": "user details",
                        "status": 1,
                        "code": res.statusCode,
                        "user": data
                    });
                }
            })
        }
    })

    // db.query(sql3, [user_id], (err, data) => {
    //     if (err) {
    //         res.send({
    //             "message": err.message,
    //             "status": 0,
    //             "code": res.statusCode,
    //             "data": data
    //         })
    //     } else {
    //         db.query(sql1, [user_id], (err, hobbiedata) => {
    //             if (err) {
    //                 res.send({
    //                     "message": err.message,
    //                     "status": 0,
    //                     "code": res.statusCode,
    //                     "data": data
    //                 })
    //             } else {
    //                 let user_hobbies = [];
    //                 hobbiedata.forEach((hobbie) => {
    //                     user_hobbies.push(hobbie.hobbie_id);
    //                 });
    //                 data.map(o => (o.hobbies = user_hobbies))
    //                 res.json({
    //                     "message": "user details",
    //                     "status": 1,
    //                     "code": res.statusCode,
    //                     "user": data
    //                 });
    //             }
    //         })
    //     }
    // })

    // db.query(sql1, [user_id], (err, data) => {
    //     if (err) {
    //         res.send({
    //             "message": err.message,
    //             "status": 0,
    //             "code": res.statusCode,
    //             "data": data
    //         })
    //     } else {
    //         let hobbies = [];
    //         data.forEach((hobbie) => {
    //             hobbies.push(hobbie.hobbie_id);
    //         });
    //         res.json({
    //             "message": "user details",
    //             "status": 1,
    //             "code": res.statusCode,
    //             "hobbies": hobbies
    //         });
    //     }
    // })

    // db.query(sql2, [user_id], (err, data) => {
    //     if (err) {
    //         res.send({
    //             "message": err.message,
    //             "status": 0,
    //             "code": res.statusCode,
    //             "data": data
    //         })
    //     } else {
    //         res.json({
    //             "message": "user details",
    //             "status": 1,
    //             "code": res.statusCode,
    //             "hobbies": data
    //         });
    //     }
    // })

})

// update user by id
user.put('/:id', function (req, res) {
    const id = req.params.id;
    var { firstname, lastname, email, password, gender, role_id, hobbies } = req.body;
    console.log("===hobbies===", hobbies);
    var sql2 = `UPDATE users SET firstname = ?, lastname = ?, email = ?, password = ?, gender = ?, role_id = ? WHERE id = ?`;
    var sql3 = ``
    db.query(sql2, [firstname, lastname, email, password, gender, role_id, id], (err, data) => {
        if (err) {
            res.send({
                "message": err.message,
                "status": 0,
                "code": res.statusCode,
                "data": req.body
            })
        } else {
            res.json({
                "message": "user details updated",
                "status": 1,
                "code": res.statusCode,
                "data": req.body
            });
        }
    })
})

// delete user by id
user.delete('/:id', function (req, res) {
    const id = req.params.id;
    const sql3 = `DELETE FROM users WHERE id = ?`;
    db.query(sql3, [id], (err, data) => {
        if (err) {
            res.send({
                "message": err.message,
                "status": 0,
                "code": res.statusCode,
                "data": data
            })
        } else {
            res.json({
                "message": "user delete successfully",
                "status": 1,
                "code": res.statusCode
            });
        }
    })
})

module.exports = user;
