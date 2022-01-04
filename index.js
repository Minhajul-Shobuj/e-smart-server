const express = require("express");
require('dotenv').config();
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
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
        const courseCollection = database.collection('courses');
        const userCollection = database.collection('users');
        const blogCollection = database.collection('blogs');
        const reviewCollection = database.collection('reviews');
        const orderCollection = database.collection('Orders')

        //get course data
        app.get('/courses', async (req, res) => {
            const query = {};
            const cursor = courseCollection.find(query);
            const courses = await cursor.toArray();
            res.json(courses);
        });

        app.get('/courses/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await courseCollection.findOne(query);
            res.json(result);
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

        //get blogs api
        app.get('/blogs', async (req, res) => {
            const query = {};
            const cursor = blogCollection.find(query);
            const blogs = await cursor.toArray();
            res.json(blogs);
        });
        //post review
        app.post('/review', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.json(result);
        });
        //get review
        app.get('/review', async (req, res) => {
            const query = {};
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.json(reviews);
        });
        app.post('/order', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result)
        })
        app.get('/orders', async (req, res) => {
            const query = {};
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.json(orders);
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