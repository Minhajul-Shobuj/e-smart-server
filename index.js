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

        //get blogs data
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

        // delete user order
        app.delete('/orders/:id', async(req, res) => {
            const dltId = req.params.id 
            const query = {_id: ObjectId(dltId)}
            const result = await orderCollection.deleteOne(query)
            res.json(result)
        })

        // set user as admin or update user as admin
        app.put('/users/admin', async(req, res) => {
            const adminEmail = req.body 
            const filter = {email: adminEmail.email}
            const updateDoc = {
                $set: {role: "admin"}
            }
            const result = await userCollection.updateOne(filter, updateDoc)
            res.json(result)
        })

        // get admin from user collection
        app.get('/users/:email', async (req, res) => {
            const userEmail = req.params.email
            const query = {email: userEmail}
            const result = await userCollection.findOne(query)
            let isAdmin = false;
            if(result?.role == "admin"){
                isAdmin = true
            }
            res.json({admin: isAdmin})

        })

        // finish all method
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