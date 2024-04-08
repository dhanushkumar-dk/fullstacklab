// index.js

const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve static files (e.g., CSS, JavaScript)

const url = "mongodb://localhost:27017";
const dbName = "mydb";
const personCollectionName = "person";
const usersCollectionName = "users";

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!");
});

// Database connection
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        const db = client.db(dbName);
        const personCollection = db.collection(personCollectionName);
        const usersCollection = db.collection(usersCollectionName);
        console.log("Connected to the database");

        // Routes
        app.get("/", (req, res) => {
            res.sendFile(__dirname + "/index.html");
        });

        app.post("/insert", async (req, res, next) => {
            try {
                const data = req.body;
                await insertData(personCollection, data);
                await saveUserInfo(usersCollection, data);
                res.redirect("/");
            } catch (error) {
                next(error);
            }
        });

        app.post("/read", async (req, res, next) => {
            try {
                const data = req.body;
                const result = await readData(personCollection, data);
                res.send(`<h2>Name: ${result.name}<br/>Age: ${result.age}</h2>`);
            } catch (error) {
                next(error);
            }
        });

        app.post("/update", async (req, res, next) => {
            try {
                const data = req.body;
                await updateData(personCollection, data);
                res.redirect("/");
            } catch (error) {
                next(error);
            }
        });

        app.post("/delete", async (req, res, next) => {
            try {
                const data = req.body;
                await deleteData(personCollection, data);
                res.redirect("/");
            } catch (error) {
                next(error);
            }
        });

        // Start server
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error("Error connecting to the database:", err);
        process.exit(1); // Exit the application if unable to connect to the database
    });

// Database operations
async function insertData(collection, data) {
    const result = await collection.insertOne(data);
    console.log("1 document inserted");
}

async function readData(collection, query) {
    const result = await collection.findOne(query);
    if (!result) {
        throw new Error("Record not found");
    }
    return result;
}

async function updateData(collection, data) {
    const filter = { name: data.name };
    const update = { $set: { name: data.upname, age: data.upage } };
    const result = await collection.updateOne(filter, update);
    if (result.modifiedCount === 0) {
        throw new Error("Record not found");
    }
    console.log("1 document updated");
}

async function deleteData(collection, query) {
    const result = await collection.deleteOne(query);
    if (result.deletedCount === 0) {
        throw new Error("Record not found");
    }
    console.log("1 document deleted");
}

// async function saveUserInfo(collection, data) {
//     const result = await collection.insertOne(data);
//     console.log("User info saved:", result.ops[0]);
// }

async function saveUserInfo(collection, data) {
    try {
        const result = await collection.insertOne(data);
        if (result && result.ops && result.ops.length > 0) {
            console.log("User info saved:", result.ops[0]);
        } else {
            throw new Error("Failed to save user info");
        }
    } catch (error) {
        console.error("Error saving user info:", error);
    }
}
