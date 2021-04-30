const express=require("express");
const app=express();
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
const MongoClient =require('mongodb').MongoClient;
app.set("view image","ejs");
app.use(express.static('public'));
var db;
//console.log(MongoClient);
MongoClient.connect('mongodb://localhost:27017/inventory',(err,database)=>{
    if(err)
    return console.log(err);
    db=database.db("inventory");
})
app.get("/",(req,res)=>{
    db.collection("products").find().toArray((err,result)=>{
        if(err) return console.log(err);
        res.render("homepage.ejs",{data:result})
    })
})
app.get("/create",(re,res)=>{
    res.render("addProduct.ejs");
})
app.get("/remove",(req,res)=>{
    res.render("removeProduct.ejs");
})
app.get("/update",(req,res)=>{
    res.render("updateStock.ejs");
})
app.get("/edit",(req,res)=>{
    res.render("editCost.ejs");
})
app.post("/EditCost",(req,res)=>{
    db.collection("products").findOneAndUpdate({pid:req.body.pid},{$set:{pcost:req.body.pcost}},{sort :{ _id:-1}},(err,result)=>{
        //console.log(result);
        if(err)
        return console.log(err);
        res.redirect("/"); 
    })
})
app.post("/RemoveProduct",(req,res)=>{
   // console.log(typeof(req.body.pid));
    db.collection("products").findOneAndDelete({pid:req.body.pid},(err,result)=>{
        //console.log(result);
        if(err)
        return console.log(err);
        res.redirect("/"); 
    })
})
app.post("/UpdateStock",(req,res)=>{
    var s;
    db.collection("products").find().toArray((err,result)=>{
        if(err)return console.log(err);
        for(var i=0;i<result.length;i++){
            if(result[i].pid==req.body.pid){
               s=result[i].pstock;
               console.log(s);
               break;
            }
        }
       
       // console.log((parseInt(s)+parseInt(req.body.pstock)).toString());
        db.collection("products").findOneAndUpdate({"pid":req.body.pid},{
            $set: {pstock:(parseInt(s)+parseInt(req.body.pstock)).toString()}},{sort :{ _id:-1}},(err,result)=>{
                if(err) return console.log(err);
                res.redirect("/");
            })
    })
})
app.post("/AddData", (req,res)=>{
   // console.log(req.body);
    db.collection("products").save(req.body,(err,result)=>{
       if(err) return console.log(err);
       res.redirect("/");
    })
})

app.listen(4000,()=>{
    console.log("listening at port number 4000");
})
