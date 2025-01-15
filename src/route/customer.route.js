const customerController = require("../controller/customer.controller") 
const customer = (app) =>{
    app.post("/api/customer/create",customerController.create);
    app.get("/api/customer/getone/:id", customerController.getone);
    app.get("/api/customer/getall",customerController.getall);
    app.put("/api/customer/update", customerController.update);
    app.delete("/api/customer/remove/:id", customerController.remove);
}
module.exports = customer;