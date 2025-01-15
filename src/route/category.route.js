const categoryController = require("../controller/category.controller") 
const category = (app) =>{
    app.post("/api/category/create",categoryController.create);
    app.get("/api/category/getone/:id", categoryController.getone);
    app.get("/api/category/getall",categoryController.getall);
    app.put("/api/category/update", categoryController.update);
    app.delete("/api/category/remove/:id", categoryController.remove);
}
module.exports = category;