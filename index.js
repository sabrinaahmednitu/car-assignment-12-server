const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient } = require("mongodb");
const  ObjectId = require('mongodb').ObjectId;
require("dotenv").config();

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fkjuk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try{
    await client.connect();
    const database = client.db("product_zone");
    const carsCollection = database.collection("car");
    const ordersCollection = database.collection("orders");
    const reviewCollection = database.collection("review");
    const usersCollection = database.collection("users");

    // all cars get
    app.get("/cars", async (req, res) => {
      const cursor = carsCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    // Add Product To The Current Cars Collection
    app.post("/addProduct", async (req, res) => {
      const product = req.body;
      const result = await carsCollection.insertOne(product);
      res.send(result);
    });

    // Admin Manage Products Delete Process
    app.delete("/deletePd/:id", async (req, res) => {
      const id = req.params.id;
      const Object = { _id: ObjectId(id) };
      const result = await carsCollection.deleteOne(Object);
      res.send(result);
    });

    // single car get
    app.get("/singleCar/:id", async (req, res) => {
      const id = req.params.id;
      const Object = { _id: ObjectId(id) };
      const result = await carsCollection.find(Object).toArray();
      res.send(result);
    });

    // add orders to the database
    app.post("/addOrders", async (req, res) => {
      const orders = req.body;
      const result = await ordersCollection.insertOne(orders);
      res.send(result);
    });

    // my order get process
    app.get("/myOrders/:email", async (req, res) => {
      const order = req.params.email;
      const result = await ordersCollection.find({ email: order }).toArray();
      res.send(result);
    });

    // All orders get process for manage orders
    app.get("/orders", async (req, res) => {
      const cursor = ordersCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    // customer ordered item delete process
    app.delete("/deleteProduct/:id", async (req, res) => {
      const id = req.params.id;
      const Object = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(Object);
      res.send(result);
    });

    // customer review
    app.post("/addReview", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });

    // review get process
    app.get("/review", async (req, res) => {
      const cursor = await reviewCollection.find({}).toArray();
      res.send(cursor);
    });

    // USER DATA POST METHOD FOR ADMIN CREATION
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    app.put("/makeAdmin", async (req, res) => {
      const filter = { email: req.body.email };
      const result = await usersCollection.find(filter).toArray();
      if (result) {
        const documents = await usersCollection.updateOne(filter, {
          $set: { role: "admin" },
        });
      }
      res.send(result);
    });

    // check admin or not
    app.get("/checkAdmin/:email", async (req, res) => {
      const result = await usersCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });


  }
  finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hello from carhouse of sabrina ahmed nitu");
});

app.listen(port, () => {
  console.log(`Port listening at ${port}`);
});
