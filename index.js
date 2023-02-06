const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

app.use(
    cors({
        origin: ["http://localhost:3000"],
        methods: "GET,POST,PUT,DELETE,OPTIONS",
    })
);
app.use(express.json());
//route imports
app.use(require("./routes/sample"));
app.use(require("./routes/authentication"));
app.use(require("./routes/users"));

mongoose.set('strictQuery', false);
// format
// mongodb+srv://<username>:<password>@cluster0.mongodb.net/<database>?retryWrites=true&w=majority
// const connUrl='mongodb://127.0.0.1:27017/app';
const connUrl = "mongodb+srv://admin:o2rRfSYGKkUCHG8s@cluster0.eh378xa.mongodb.net/netsTest?retryWrites=true&w=majority";
mongoose.connect(connUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    autoIndex: true, //make this also true
})
    .then(() => console.log("Database connected!"))
    .catch(err => console.log(err));

app.get("/", (req, res) => {
    return res.json({ message: "Access to this page is not allowed", active: false });
});

app.listen(1337, () => {
    console.log("Node Server running on port 1337");
})
