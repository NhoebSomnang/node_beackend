const express = require("express")
const app = express();
app.use(express.json())


require("./src/route/customer.route")(app)
require("./src/route/category.route")(app)




const port = 8082;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
