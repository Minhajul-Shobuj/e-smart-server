const express = require("express");
require('dotenv').config();
const cors = require('cors');
const { MongoClient } = require('mongodb');
const { use } = require("express/lib/router");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2qgak.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        // console.log('connected to database')
        const database = client.db('E-Smart');
        const courseCollection = database.collection('courses')
        const userCollection = database.collection('users');

        //get course data
        app.get('/courses', async (req, res) => {
            const query = {};
            const cursor = courseCollection.find(query);
            const courses = await cursor.toArray();
            res.json(courses);
        });

        //post user
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.json(result);
        });

        //get user data
        app.get('/users', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.json(users);
        });
    }
    finally {
        // await client.close()
    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("E-smart server")
});
app.listen(port, (req, res) => {
    console.log(`listening to port ${port}`)
});