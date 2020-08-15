require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const port = 5000;

if (process.env.DEVELOPMENT) {
    app.use(cors());
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send("Server is alive");
})

app.use('/api/v1/accounts', require("./routes/account"));
app.use('/api/v1/transactions', require("./routes/transaction"));

app.listen(port, () => {
    console.log(`Server running at port ${port}`);
})