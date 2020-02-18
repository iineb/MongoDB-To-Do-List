const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", { useUnifiedTopology: true, useNewUrlParser: true });

const itemsSchema = {
	task: {
		type: String,
		required: true,
		maxlength: 50
	}
};

const Item = mongoose.model("Item", itemsSchema);

const itemOne = new Item({
	task: "You have no tasks today!"
});

const defaultItems = [itemOne];

const listSchema = {
	name: String,
	items: [
		itemsSchema
	]
};

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res) {
	const day = date.getDate();
	Item.find({}, function(err, foundItems) {
		if (err) {
			console.log(err);
		} else if (foundItems.length === 0){
			// Item.insertMany(defaultItems, function(err) {
			// 	if (err) {
			// 		console.log(err);
			// 	} else {
			// 		console.log("Successfully added default items to the database");
			// 	}
			// });
			const emptyTasks = "You currently have no tasks today!";
			res.render("list", {listTitle: day, newListItems: foundItems, notifications: emptyTasks});
		} else {
			const fullTasks = "Your tasks for today are:";
			res.render("list", {listTitle: day, newListItems: foundItems, notifications: fullTasks});
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
		err ? console.log(err) : console.log("Task deleted successfully.");;
	});
	res.redirect("/");
});

// app.get("/:customList", function(req, res) {
// 	const id = req.params.customList;
	
// 	List.findOne({name: id}, function(err, foundList) {
// 		if (err) {
// 			console.log(err);
// 		} else {
// 			if (!foundList) {
// 				const list = new List({
// 					name: id,
// 					items: defaultItems
// 				});
// 				list.save();
// 				res.redirect(`/${id}`);
// 			} else {
// 				res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
// 			}
// 		}
// 	});
// });

app.listen(3000, function() {
    console.log("Server started on port 3000");
});
