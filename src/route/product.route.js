const productController = require("../controller/product.controller") 
const product = (app) =>{
    app.post("/api/product/create",productController.create);
    app.get("/api/product/getone/:id", productController.getone);
    app.get("/api/product/getall",productController.getall);
    app.put("/api/product/update", productController.update);
    app.delete("/api/product/remove/:id", productController.remove);
}
module.exports = product;