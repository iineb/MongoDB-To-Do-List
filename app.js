const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const newList = [];

app.get("/", function(req, res) {
	const day = date.getDate();
	res.render("list", {listTitle: day, newListItems: newList});
});

app.post("/", function(req, res){
	const newItem = req.body.newTask;
    newList.push(newItem);
    res.redirect("/");
});

app.get("/add-a-task", function(req,res){
    res.render("list", {listTitle: "Add a task to do", newListItems: newList});
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});
