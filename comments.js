// Create web server 

// Import modules
const express = require('express');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

// Create web server
const app = express();
const port = 3000;

// Use middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
const url = 'mongodb://localhost:27017';
const dbName = 'myproject';
const client = new MongoClient(url, { useUnifiedTopology: true });
let db;

client.connect(function (err) {
    console.log("Connected successfully to server");
    db = client.db(dbName);
});

// Routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/comments', (req, res) => {
    db.collection('comments').find({}).toArray(function (err, docs) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            res.send(docs);
        }
    });
});

app.post('/comments', [
    check('name').isLength({ min: 1 }),
    check('message').isLength({ min: 1 })
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        res.sendStatus(400);
    } else {
        db.collection('comments').insertOne(req.body, function (err, result) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
            } else {
                res.sendStatus(201);
            }
        });
    }
});

app.delete('/comments/:id', (req, res) => {
    db.collection('comments').deleteOne({ _id: ObjectId(req.params.id) }, function (err, result) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});

// Start web server
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});