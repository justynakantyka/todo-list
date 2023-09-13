import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import _ from 'lodash';

const app = express();
const port = 3000;
const defaultListName = "Today";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/todolistDB");


const taskSchema = new mongoose.Schema({
    name: String
})

const Task = mongoose.model("Task", taskSchema);

const listSchema = {
    name: String,
    tasks: [taskSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", async (req, res) => {
    const tasks = await Task.find({});
    res.render("index.ejs", {listTitle: defaultListName, taskList: tasks});
});

app.get("/favicon.ico", (req,res)=>{
    return "your favicon";
})   

app.get("/:taskType", async(req, res) => {
    const taskType = _.capitalize(req.params.taskType);
    const tasksList = await List.findOne({name: taskType});
    if(!tasksList){
        const list = new List({
            name: taskType,
            tasks: []
        });
        await list.save();
        res.redirect("/" + taskType);
    } else {
        res.render("index.ejs", {listTitle: tasksList.name, taskList: tasksList.tasks});
    }
  })

app.post("/", async(req, res) => {
    const taskName = req.body.task;
    const listName = req.body.listTitle;
    const task = new Task({
        name: taskName
    });

    if(listName === defaultListName) {
        task.save();
        res.redirect("/");
    } else {
        const foundList = await List.findOne({name: listName});
        foundList.tasks.push(task);
        foundList.save();
        res.redirect("/" + listName);
    }
});

app.post("/delete", async(req, res) => {
    const checkedTaskId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === defaultListName) {
        await Task.findByIdAndRemove(checkedTaskId);
        res.redirect("/");
    } else {
        await List.findOneAndUpdate({name: listName}, { $pull: {tasks: {_id: checkedTaskId}}});
        res.redirect("/" + listName);
    }
});

app.listen(port, () => {
    console.log(`App started on port ${port}`);
});
