const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());
app.get("/", (req, res) => {
    res.send("🚀 Transaction System API is running!");
});

app.get("/demo", (req, res) => {
    res.json({
        message: "Transaction API working",
        endpoints: {
            create: "/api/create (POST)",
            transfer: "/api/transfer (POST)"
        }
    });
});
app.use("/api", require("./routes/transactionRoutes"));

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});