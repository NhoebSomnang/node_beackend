const express = require("express")
const app = express();

require("./src/route/customer.route")(app)




const port = 8081;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
