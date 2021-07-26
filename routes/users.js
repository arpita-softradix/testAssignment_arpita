var express = require('express');
var user = express.Router();

//  user registration
user.post('/', function (req, res) {
    const { firstname, lastname, email, password, gender, role_id, hobbies} = req.body;
    const is_user_exist_query = `SELECT * from users WHERE email = ?`;
    db.query(is_user_exist_query, [req.body.email], function (err, result) {
        if (err) {
            res.send({
                "message": err.message,
                "status": 0,
                "code": res.statusCode,
                "data": req.body
            })
        } else {
            //Check user already exist 
            if(result.length){
                return res.send({
                    message: "user already exists",
                    status: 1,
                    code: res.statusCode,
                    data: result
                });
            }
                const insert_user_query = `INSERT INTO users (firstname, lastname, email, password, gender, role_id) VALUES (?,?,?,?,?,?)`;
                db.query(insert_user_query, [firstname, lastname, email, password, gender, role_id], function (err, data) {
                    if (err) {
                        res.send({
                            message: err.message,
                            status: 0,
                            code: res.statusCode,
                            data: req.body
                        })
                    };
                    let user_id = data.insertId;
                    let insert_user_hobbies_query = `INSERT INTO user_hobbies (user_id, hobbie_id) VALUES ?`;
                    let value = [];
                    hobbies.forEach(user => {
                        value.push([user_id, user]);
                    });
                    db.query(insert_user_hobbies_query, [value], function (err, data) {
                        if (err) {
                            res.send({ message: err.message })
                        } else {
                            console.log("user register successfully");
                            res.send({
                                message: "register successfully",
                                status: 1,
                                code: res.statusCode,
                                data: req.body
                            });
                        }
                    })
                })
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
    const get_user_list_query = `SELECT users.*, h.hobbies FROM users
                LEFT JOIN (SELECT user_id,
                                    GROUP_CONCAT(DISTINCT hobbie_id
                                                ORDER BY hobbie_id DESC SEPARATOR ', ') AS hobbies
                                FROM user_hobbies
                                GROUP BY user_id) as h
                ON users.id = h.user_id`;
    db.query(get_user_list_query, function (err, data) {
        if (err) {
            res.send({
                message: err.message,
                status: 0,
                code: res.statusCode,
                data: data
            })
        } else {
            res.json({
                message: "list of users",
                status: 1,
                code: res.statusCode,
                data: data
            });
        }
    })
})

// get user by id
user.get('/:id', function (req, res) {
    const user_id = req.params.id;
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
    const sql1 = `DELETE `
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
