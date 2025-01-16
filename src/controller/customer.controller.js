const db = require("../config/db.config")
const bcrypt = require("bcrypt")
const customer = require("../route/customer.route")
const create = (req,res) =>{
    let body = req.body
    let password = bcrypt.hashSync(body.password,10)
    let sqlInsert = "INSERT INTO customer (firstname, lastname, gender, username, password) VALUES (?, ?, ?, ?, ?)"
    let paramInsert = [body.firstname,body.lastname,body.gender,body.username,password]
    db.query(sqlInsert,paramInsert,(error,rows)=>{
        if(error){
            res.json({
                error: error,
                message: "Error inserting data"
            })
        }else{
            res.json({
                data: rows,
                message: "Data inserted successfully"
            })
        }
    })
}

const getone = (req, res) => {
    let customer_id = req.params.id;
    let sqlGetOne = "SELECT * FROM customer WHERE customer_id = ?";
    let paramGetOne = [customer_id];

    db.query(sqlGetOne, paramGetOne, (error, rows) => {
        if (error) {
            res.json({
                error: error,
                message: "Error retrieving data"
            });
        } else if (rows.length === 0) {
            // No data found for the given customer_id
            res.status(404).json({
                message: "No more inventory info"
            });
        } else {
            res.json({
                data: rows,
                message: "Data retrieved successfully"
            });
        }
    });
};

const getall = (req,res) =>{
    db.query("SELECT * FROM customer;",(error,rows)=>{
        if(error){
            res.json({
                error: error,
                message: "Error retrieving data"
            })
        }else{
            res.json({
                data: rows,
                message: "Data retrieved successfully"
            })
        }
    })
}

// const update = (req, res) => {
//     let body = req.body;
//     let sqlUpdate = `
//         UPDATE customer 
//         SET firstname = ?, 
//             lastname = ?, 
//             gender = ?, 
//             username = ?, 
//             password = ? 
//         WHERE customer_id = ?;
//     `;
//     let params = [
//         body.firstname,
//         body.lastname,
//         body.gender,
//         body.username,
//         body.password,
//         body.customer_id
//     ]

//     db.query(sqlUpdate, params, (error, rows) => {
//         if (error) {
//             return res.json({
//                 error: error,
//                 message: "Error updating data"
//             });
//         }
//         if (rows.affectedRows === 0) {
//             return res.status(404).json({
//                 message: "Customer not found"
//             });
//         }
//         res.json({
//             data: rows,
//             message: "Customer updated successfully"
//         });
//     });
// };

const update = (req, res) => {
    let body = req.body;
    let customer_id = body.customer_id;

    // Step 1: Check the last updated timestamp
    let checkLastUpdatedSql = "SELECT last_updated FROM customer WHERE customer_id = ?";

    db.query(checkLastUpdatedSql, [customer_id], (error, results) => {
        if (error) {
            return res.json({
                error: error,
                message: "Error checking last update time"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        const lastUpdated = new Date(results[0].last_updated);
        const now = new Date();
        const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds

        // Step 2: Check if the last update was less than 5 minutes ago
        if (now - lastUpdated < fiveMinutes) {
            return res.status(403).json({
                message: "Updates are allowed only every 5 minutes"
            });
        }

        // Step 3: Proceed with the update
        let sqlUpdate = `
            UPDATE customer 
            SET firstname = ?, 
                lastname = ?, 
                gender = ?, 
                username = ?, 
                password = ?, 
                last_updated = NOW() 
            WHERE customer_id = ?;
        `;
        let params = [
            body.firstname,
            body.lastname,
            body.gender,
            body.username,
            body.password,
            customer_id
        ];

        db.query(sqlUpdate, params, (error, rows) => {
            if (error) {
                return res.json({
                    error: error,
                    message: "Error updating data"
                });
            }
            res.json({
                data: rows,
                message: "Customer updated successfully"
            });
        });
    });
};
const remove = (req, res) => {
    let customer_id = req.params.id;

    let sqlDelete = "DELETE FROM customer WHERE customer_id = ?;";
    let params = [customer_id];

    db.query(sqlDelete, params, (error, rows) => {
        if (error) {
            return res.json({
                error: error,
                message: "Error deleting data"
            });
        }
        if (rows.affectedRows === 0) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }
        res.json({
            data: rows,
            message: "Customer deleted successfully"
        });
    });
};
const login = (req,res)=>{
    let {username,password} = req.body
    let message = {}
    if(username == null || username == ""){
        message.username = "Username is required"
    }
    if(password == null || password == ""){
        message.password = "Password is required"
    }
    if(Object.keys(message).length > 0){
        return res.json(message)
    }
    let sqlLogin = "SELECT * FROM customer WHERE username =?;"
    let paramLogin = [username]
    db.query(sqlLogin,paramLogin,(error,rows)=>{
        if(error){
            res.json({
                error: error,
                message: "Error retrieving data"
            })
        }else if(rows.length === 0){
            res.json({
                message: "username dose not exit"
            })
        }else{
            let customer = rows[0]
            let isValidPassword = bcrypt.compareSync(password,rows[0].password)
            if(isValidPassword){
                delete customer.password
                res.json({
                    profile: rows[0],
                    message: "Logged in successfully"
                })
            }else{
                res.json({
                    message: "password incorrect "
                })
            }
        }
    })
}

module.exports={
    create,
    getone,
    getall,
    update,
    remove,
    login,
}