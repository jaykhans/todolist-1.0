const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
require("dotenv").config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use(express.static("public"));

dbPassword = process.env.DB_PASSWORD;

mongoose.connect(`mongodb+srv://admin-jay:${dbPassword}@jaycluster.dx6ei.mongodb.net/todolistDB`, {useNewUrlParser: true});

const itemsSchema = new mongoose.Schema({
  name: String
})

const Item = new mongoose.model("Item", itemsSchema);

const firstItem = new Item({
  name: "Welcome to the todo app"
})

const secondItem = new Item({
  name: "Hit the + to add an item"
})

const thirdItem = new Item({
  name: "<-- Hit the - to remove an item"
})

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema]
})

const defaultItems = [firstItem, secondItem, thirdItem];

const List = new mongoose.model("List", listSchema);

app.get("/", function (req, res) {

  
  Item.find({}, function(err, foundItems) {
    //if the items are not found, then add default three items from defaultitems array. Else just go to that page
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function (err){
        if (err) {
          console.log(err)
        } else {
          console.log("Success!")
        }
      });
      res.redirect("/");

    } else {
      res.render("list", { listTitle: "Today", newListItems: foundItems });
    }

    
  })
  
});


app.get("/:customListname", function(req, res) {
  // when after "/" in the url written name of the list, that list will be created or will go to that list if exists.
  const customListname = _.capitalize(req.params.customListname);
  if (customListname === "favicon.ico") {
    res.redirect("/");
  } else {
    List.findOne({name: customListname}, function(err, listFound) {
      if (!err) {
        if (!listFound){
          //Create the list 
          const list = new List({
            name: customListname,  
            items: defaultItems  
          })
           list.save();
          res.redirect("/" + customListname)
        } else {
            //Show the existing list
            res.render('list', { listTitle: listFound.name, newListItems: listFound.items })
        }
      } 
    })
  }
  
    
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  })

  if (listName === "Today") {
    //When + button clicks, item saves in the list which user in there.
    item.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}, function (err, foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    })
  }
   

});

app.post("/delete", function(req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;
    
  if (listName === "Today") {
  //if item ticks, remove it from that list.

    Item.findByIdAndRemove(checkedItemId, function(err) {
      if(err){
        console.log(error)
      } else {
        console.log("Successfully deleted!")
        res.redirect("/")
      }
    })
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
      if(!err) {
        res.redirect("/" + listName);
      }
    })
  }
})

let port = process.env.PORT 
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server has started successfully!");
}); 
