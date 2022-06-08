let express = require('express');
let app=express();
const mongo=require('mongodb');
const MongoClient=mongo.MongoClient;
const mongoUrl="mongodb+srv://intern:intern123@cluster0.o2tk1.mongodb.net/novintern?retryWrites=true&w=majority"
const dotenv=require('dotenv')
dotenv.config
const bodyParser= require('body-parser')
const cors = require('cors')
let port= process.env.PORT || 8910 ;
var db;

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cors())

app.get('/location',(req,res)=> {
    db.collection('location').find().toArray((err,result)=>{
        if (err) throw err;
        res.send(result)   
    }
   )
   
})




app.get('/restaurants',(req,res)=> {
    let restId =Number(req.query.state_id )
    let mealId = Number(req.query.meal_id)
    let query = {};
    if(restId && mealId){
        query = {"mealTypes.mealtype_id":mealId,state_id:restId}
    }
    else if(restId){
        query = {state_id:restId}
    }

    else if(mealId){
        query = {"mealTypes.mealtype_id":mealId}
    }
 db.collection('restaurants').find(query).toArray((err,result)=>{
        if (err) throw err;
        res.send(result)   
    }
   )
   
})

//filters
app.get('/filter/:mealId',(req,res)=> {
    let sort={cost:1}
    let mealId=Number(req.params.mealId)
    let skip =0;
    let limit= 100000000000000;
    let cuisineId = Number(req.query.cuisine)
    let lcost=Number (req.query.lcost);
    let hcost=Number (req.query.hcost);
    let query={}
    if(req.query.sort){
        sort={cost:req.query.sort}
    }
    if(req.query.skip && req.query.limit){
       skip = Number (req.query.skip);
       limit = Number (req.query.limit);
    }
    
   
    if(cuisineId&lcost&hcost){
        query={"cuisines.cuisine_id":cuisineId,"mealTypes.mealtype_id":mealId,$and:[{cost:{$gt:lcost,$lt:hcost}}]}   
    }
    else if(cuisineId){
        query={"cuisines.cuisine_id":cuisineId,"mealTypes.mealtype_id":mealId}
    }
    else if(lcost&hcost){
        query={$and:[{cost:{$gt:lcost,$lt:hcost}}],"mealTypes.mealtype_id":mealId} 
    }
 db.collection('restaurants').find(query).sort(sort).skip(skip).limit(limit).toArray((err,result)=>{
        if (err) throw err;
        res.send(result)   
    }
   )
   
})

//quicksearch
app.get('/quicksearch',(req,res)=> {
    let restId =Number(req.params.id );
 db.collection('quicksearch').find().toArray((err,result)=>{
        if (err) throw err;
        res.send(result)   
    }
   )
   
})

//details of rest
app.get('/details/:id',(req,res)=> {
    let restId =Number (req.params.id )
  //let  restId=mongo.ObjectId(req.params.id)
 db.collection('restaurants').find({restaurant_id:restId}).toArray((err,result)=>{
        if (err) throw err;
        res.send(result)   
    }
   )
   
})
//menu wrt restaurant
app.get('/details/:id',(req,res)=> {
    let restId =Number (req.params.id )
  //let  restId=mongo.ObjectId(req.params.id)
 db.collection('restaurants').find({restaurant_id:restId}).toArray((err,result)=>{
        if (err) throw err;
        res.send(result)   
    }
   )
   
})

//menu wrt restaurant
app.get('/menu/:id',(req,res)=> {
    let restId =Number (req.params.id )
  //let  restId=mongo.ObjectId(req.params.id)
 db.collection('menu').find({restaurant_id:restId}).toArray((err,result)=>{
        if (err) throw err;
        res.send(result)   
    }
   )
   
})



//menu on basis of user selection
app.get('/orders',(req,res)=> {
    let email =req.query.email 
    let mealId = Number(req.query.meal_id)
    let query = {};
    if(email){
        query = {"email":email}
    }
    
 db.collection('orders').find(query).toArray((err,result)=>{
        if (err) throw err;
        res.send(result)   
    }
   )
   
})
//place order (post)
app.post('/placeOrder',(req,res)=>{
    //console.log(req.body)
    db.collection('orders').insert(req.body,(err,result)=>{
        if (err) throw err;
        res.send('Order Added')
})
})

app.post('/menuItem',(req,res)=>{
    console.log(req.body)
    db.collection('menu').find({menu_id:{$in:req.body}}).toArray((err,result)=>{
        if (err) throw err;
        res.send(result)
})
})

app.delete('/deleteOrder',(req,res)=>{
    
    db.collection('orders').remove({},(err,result)=>{
        if (err) throw err;
        res.send(result)
})
})

MongoClient.connect( mongoUrl, (err, connection)=> {
    if (err) console.log ("error while connecting");
    db = connection.db ("novintern")
    app.listen(port,()=>{
        console.log(`Listening to the port ${port}`)
    })
})

