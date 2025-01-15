const db = require("../config/db.config")
const create = (req,res) =>{
    let {name,description,image} = req.body
    if(name == null || name == ""){
        res.status(400).json({message: 'Name cannot be empty'})
        return
    }
    let sqlInsert = "INSERT INTO category (name,description,image) VALUES (?, ?, ?)"
    let sqlparam = [name, description, image]
    db.query(sqlInsert, sqlparam, (err, result) => {
        if(err) throw err
        res.json({
            data : result,
            message: 'Data Inserted'})
    })
}

const getone = (req, res) => {
    let customer_id = req.params.id;
    let sqlGetOne = "SELECT * FROM category WHERE category_id = ?";
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

const getall = (req,res) => {
    db.query("SELECT * FROM category;",(error,rows)=>{
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
const update = (req, res) => {
    let body = req.body;
    let category_id = body.category_id;

    // Step 1: Check the last updated timestamp
    let checkLastUpdatedSql = "SELECT last_updated FROM category WHERE category_id = ?";

    db.query(checkLastUpdatedSql, [category_id], (error, results) => {
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
            SET name = ?, 
                description = ?, 
                image = ?,  
                last_updated = NOW() 
            WHERE category_id = ?;
        `;
        let params = [
            body.name,
            body.description,
            body.image,
            category_id
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

    let sqlDelete = "DELETE FROM category WHERE category_id = ?;";
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

module.exports ={
    create,
    getone,
    getall,
    update,
    remove,
 
}