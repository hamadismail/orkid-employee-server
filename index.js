require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.donur6y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    // create database
    const orkidEmployee = client.db("orkidDB").collection("employee");

    // post hobbies to database
    app.post("/employee", async (req, res) => {
      const newEmploye = req.body;
      const result = await orkidEmployee.insertOne(newEmploye);
      res.send(result);
    });

    // get hobbies from database
    app.get("/employee", async (req, res) => {
      const result = await orkidEmployee.find().toArray();
      res.send(result);
    });

    app.patch("/employee", async (req, res) => {
      const { email, lastSignInTime } = req.body;
      const filter = { email: email };
      const updatedDoc = {
        $set: {
          lastSignInTime: lastSignInTime,
        },
      };

      const result = await orkidEmployee.updateOne(filter, updatedDoc);
      res.send(result);
    });

    // app.get("/hobbies/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) };
    //   const result = await hobbyCollection.findOne(query);
    //   res.send(result);
    // });

    // // update hobby
    // app.put("/hobbies/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const filter = { _id: new ObjectId(id) };
    //   const options = { upsert: true };
    //   const updateHobby = req.body;

    //   const updatedDoc = {
    //     $set: updateHobby,
    //   };

    //   const result = await hobbyCollection.updateOne(
    //     filter,
    //     updatedDoc,
    //     options
    //   );
    //   res.send(result);
    // });

    // // delete hobbies category from the database
    // app.delete("/hobbies/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) };
    //   const result = await hobbyCollection.deleteOne(query);
    //   res.send(result);
    // });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
