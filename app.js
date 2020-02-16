const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemsSchema = {
	task: String
};

const Item = mongoose.model("Item", itemsSchema);

const itemOne = new Item({
	task: "Default Task One"
});

const itemTwo = new Item({
	task: "Default Task Two"
});

const itemThree = new Item({
	task: "Default Task Three"
});

const defaultItems = [itemOne, itemTwo, itemThree];

app.get("/", function(req, res) {
	const day = date.getDate();

	Item.find({}, function(err, foundItems) {
		if (err) {
			console.log(err);
		} else if (foundItems.length === 0){
			Item.insertMany(defaultItems, function(err) {
				if (err) {
					console.log(err);
				} else {
					console.log("Successfully added default items to the database");
				}
			});
			res.redirect("/");
		} else {
			res.render("list", {listTitle: day, newListItems: foundItems})
		}
	});
	
});

app.post("/", function(req, res){
	const newItem = req.body.newTask;
	const item = new Item({
		task: newItem
	});
	item.save();
	res.redirect("/");
});

app.post("/delete", function(req, res) {
	const id = req.body.deleteTask;
	Item.findByIdAndRemove(id, function(err) {
		if (err) {
			console.log(err);
		} else {
			console.log("Task deleted successfully.");
		}
	});
	res.redirect("/");
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});
