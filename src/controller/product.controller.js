const db = require("../config/db.config")
const create = (req, res) => {
    let { category_id, name, description, price, quantity, image, status } = req.body
    let message = {}
    if (category_id == null || category_id == "") {
        message.category_id = "Please fill in category_id"
    }
    if (name == null || name == "") {
        message.name = "Please fill in Product name"
    }
    if (description == null || description == "") {
        message.description = "Please fill in Product description"
    }
    if (price == null || price == "") {
        message.price = "Please fill in Product price"
    }
    if (quantity == null || quantity == "") {
        message.quantity = "Please fill in Product quantity"
    }
    if (status == null || status == "") {
        message.status = "Please fill in Product status"
    }
    if (Object.keys(message).length > 0) {
        res.json({
            error: true,
            message: message
        })
        return
    }

    let sqlInsert = "INSERT INTO product (name, description, price, quantity, image,status) VALUES (?, ?, ?, ?, ?, ?)"
    let paramInsert = [name, description, price, quantity, image, status]
    db.query(sqlInsert, paramInsert, (error, rows) => {
        if (error) {
            res.json({
                error: error,
                message: "Error inserting data"
            })
        } else {
            res.json({
                data: rows,
                message: "Data inserted successfully"
            })
        }
    })
}

const getone = (req, res) => {
    let product_id = req.params.id;
    let sqlGetOne = "SELECT * FROM product WHERE product_id = ?";
    let paramGetOne = [product_id];

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

const getall = (req, res) => {
    db.query("SELECT * FROM product;", (error, rows) => {
        if (error) {
            res.json({
                error: error,
                message: "Error retrieving data"
            })
        } else {
            res.json({
                data: rows,
                message: "Data retrieved successfully"
            })
        }
    })
}
const update = (req, res) => {
    let body = req.body;
    let product_id = body.product_id;
    // Step 1: Check the last updated timestamp
    let checkLastUpdatedSql = "SELECT last_updated FROM product WHERE product_id = ?";

    db.query(checkLastUpdatedSql, [product_id], (error, results) => {
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
            UPDATE product
            SET category_id = ?,
                name = ?, 
                description = ?, 
                price = ?, 
                quantity = ?, 
                image = ?, 
                status =?,
                last_updated = NOW() 
                WHERE product_id = ?;
                `;
        let params = [
           body.category_id,
           body.name,
           body.description,
           body.price,
           body.quantity,
           body.image,
           body.status,
           body.product_id
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
    let product_id = req.params.id;

    let sqlDelete = "DELETE FROM product WHERE product_id = ?;";
    let params = [product_id];

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

module.exports = {
    create,
    getone,
    getall,
    update,
    remove,
}