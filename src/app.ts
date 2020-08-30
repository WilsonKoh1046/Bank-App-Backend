import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import accountRoute from "./routes/account";
import transactionRoute from "./routes/transaction";

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.get("/", (req, res) => {
    res.send("Server is alive \n");
});

app.use("/api/v1/accounts", accountRoute);
app.use("/api/v1/transaction", transactionRoute);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});