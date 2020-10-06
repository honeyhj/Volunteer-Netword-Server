const express =require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
const { ObjectID } = require('mongodb');
require('dotenv').config();
const port=5500;

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qulux.mongodb.net/volunteerActivity?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });

const app=express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());

client.connect(err => {
    const allActivityCollection = client.db("volunteerActivity").collection("allActivity");
    const registerActivityCollection = client.db("volunteerActivity").collection("registeredActivities");
    console.log('db connected');
/*=====CREATE ACTIVITY=====*/
    app.post('/allActivity',(req,res)=>{
        const activities= req.body;
        allActivityCollection.insertOne(activities)
        .then(result=>{
            res.send('added')
        })
    });
    /*=====REGISTERED ACTIVITY=====*/
    app.post('/registerActivity',(req,res)=>{
        const registered= req.body;
        registerActivityCollection.insertOne(registered)
        .then(result=>{
            res.redirect('http://localhost:3000/singleUserActivities')
        })
    });
/*=====LOAD ALL ACTIVITY=====*/
    app.get('/registerActivity',(req,res)=>{
        registerActivityCollection.find({})
        .toArray((err,documents)=>{
            res.send(documents)
        })
    });
    app.get('/allActivity',(req,res)=>{
        allActivityCollection.find({})
        .toArray((err,documents)=>{
            res.send(documents)
        })
    });
    app.get('/allActivity/:key',(req,res)=>{
        allActivityCollection.find({key:(req.params.key)})
        .toArray((err,document)=>{
            res.send(document[0])
        })
    });
    app.get('/singleUserActivities',(req,res)=>{
        registerActivityCollection.find({email:req.query.email})
        .toArray((err,documents)=>{
            res.send(documents)
        })
    })
    app.delete('/delete/:id',(req,res)=>{
        registerActivityCollection.deleteOne({_id:ObjectID(req.params.id)})
        .then(result=>{
            res.send(result.deletedCount > 0)
        })
    })
    });

app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/index.html')
})
app.listen(process.env.PORT || port);