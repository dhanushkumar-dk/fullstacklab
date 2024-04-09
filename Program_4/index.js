const express = require("express")
const path = require("path")
const app = express()

app.use(express.urlencoded())
app.get("/", (req, res) => {
    console.log("working")
    res.sendFile(path.join(__dirname, '/index.html'))
})

app.post("/", (req, res) => {
    if (req.body.username == "root" && req.body.password == "root") {
        res.send("login success")
    }
    else {
        res.send("login failed")
    }
})

app.listen(4000);
console.log("Server started at http://localhost:4000")