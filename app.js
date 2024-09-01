const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.static('public'));    //folder containing static files are by default not loaded in express. So it must be loaded first. Static files means server files that the client needs to download to load complete web page
app.use(express.urlencoded({extended: true}));
app.set("view engine","ejs");
mongoose.connect("mongodb://localhost:27017/todolist");

const todoSchema = mongoose.Schema({
    taskname: String
});

const todoModel = mongoose.model("tasks",todoSchema);

app.get("/", function(req,res){
    todoModel.find({})                             //.find({}) will return each data in array form.
    .then(foundItems =>{
        res.render("list", {ejsarr: foundItems}); //render foundItems from mongodb and then transfer it inside ejs variable
    })
    .catch(err =>{
       console.log(err);
    });

});

app.post("/", function(req,res){
    var element = req.body.listelement; //get the entered data from body, create an object to store it and then finally insert it in database
    const newtask = new todoModel({
        taskname: element
    });
    newtask.save();
    res.redirect("/"); 
}); 

app.post("/delete", async function(req,res){ //its better to use async - await to make sure that deletion is done first before refreshing the page.
    var deleteID = req.body.delete;
    await todoModel.findByIdAndDelete(deleteID);
    res.redirect("/");
});

app.listen(3000, function(){
    console.log("Server started at PORT 3000");
});