//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require('mongoose');
const app = express();
const _ =require('lodash');

const date=require(__dirname+"/date.js");


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-mario:Test456@cluster0.7zk6h.mongodb.net/ToDoListDB",{ useNewUrlParser:true,useUnifiedTopology:true});
//mongoose.connect("mongodb://localhost:27017/ToDoListDB",{ useNewUrlParser:true,useUnifiedTopology:true});

const ToDoListSchema={
  name:String
};

const Item=mongoose.model("Item",ToDoListSchema);

const item1=new Item ({
  name:"Welcome to your ToDoList"
});
const item2=new Item ({
  name:"Press the + to add an item"
});
const item3=new Item ({
  name:"Click the checkbox to delete an item"
});

const defaultItems =[item1,item2,item3];

const listSchema= {
  name:String,
  items:[ToDoListSchema]
};

const List=mongoose.model("List",listSchema);

//var d=new Date();
const d="ToDoList for "+date.getDate();



app.get("/", function (req, res) {
  Item.find(function (err, items) {
    if (items.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully saved default items to the database");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: d, newListItems: items });
    }
  });
});

app.post("/", function(req, res){
  const itemName = req.body.newItem;
  const listName= req.body.list;
  const item = new Item({
    name: itemName
  });
  if(listName==d)
  {
    item.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/");
      }
    });
  }
  else
  {
    List.findOne({name:listName},function(err,foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/"+ listName);
    });
  }

});

app.post("/delete",function(req,res) {
  const delId=req.body.checkbox;
  const listName=req.body.listName;
  if(listName==d)
  {
    Item.deleteOne({_id:delId},function(err) {
      if(err) {
        console.log("err");
      }
      else {
        //console.log("Item deleted");
      }
      res.redirect("/");
    });
  }
  else
  {
    List.findOneAndUpdate({name:listName},{$pull:{items:{_id:delId}}},{useFindAndModify:false},function(err,foundList) {
      if(err) {
        console.log(err);
      }
      else {
        res.redirect("/"+listName);
      }
    });

  }


  });

  app.get("/about", function(req, res){
    res.render("about");
  });

app.get("/:name",function(req,res){
    //var requestedList=req.params.name;
    const listName=_.capitalize(req.params.name);
    List.findOne({name:listName},function(err,foundList) {
      if (!err) {
        if (!foundList) {
          const list= new List({
            name:listName,
            items:defaultItems
          });
          list.save(function(err,result) {
            res.redirect("/"+listName);
          });
        }
        else {
          res.render("list", { listTitle:foundList.name, newListItems: foundList.items });
        }
      }
    });
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
  console.log("Server has started Successfully");
});
