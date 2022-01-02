const express = require("express");
require('dotenv').config();
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2qgak.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        // console.log('connected to database')
        const database = client.db('E-Smart');
        const courseCollection = database.collection('courses')

        app.get('/courses', async (req, res) => {
            const query = {};
            const cursor = courseCollection.find(query);
            const projects = await cursor.toArray();
            res.json(projects);
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