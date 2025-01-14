const customerController = require("../controller/customer.controller") 
const customer = (app) =>{
    app.get("/api/customer/create",customerController.create);
    app.get("/api/customer/getone", customerController.getone);
    app.get("/api/customer/getall",customerController.getall);
    app.get("/api/customer/update", customerController.update);
    app.get("/api/customer/remove", customerController.remove);
}
module.exports = customer;