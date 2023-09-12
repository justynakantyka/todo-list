import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/todolistDB");

const taskSchema = new mongoose.Schema({
    name: String
})

const Task = mongoose.model("Task", taskSchema);
const task = new Task({
    name: "Take out the trash"
});

const task2 = new Task({
    name: "Clean mirrors and windows"
});

const defaultTasks = [task, task2];

const listSchema = {
    name: String,
    tasks: [taskSchema]
};

const List = mongoose.model("List", listSchema);


app.get("/", async (req, res) => {
    const tasks = await Task.find({});
    if(tasks.length === 0) {
        await Task.insertMany(defaultTasks);
        res.redirect("/");
    } else {
        res.render("index.ejs", {taskList: tasks});
    }
});

app.get("/:taskType", async(req, res) => {
    const taskType = req.params.taskType;
    const tasksList = await List.findOne({name: taskType});
    if(!tasksList){
        const list = new List({
            name: taskType,
            tasks: defaultTasks
        })
        list.save();
        console.log('doesnt exist');
    } else {
        res.render("index.ejs", {listTitle: tasksList.name, newTasks: tasksList.tasks});
    }
  })

app.post("/", async(req, res) => {
    const taskName = req.body.task;
    const task = new Task({
        name: taskName
    });
    task.save();

    res.redirect("/");
});

app.post("/delete", async(req, res) => {
    const checkedTaskId = req.body.checkbox;

    await Task.findByIdAndRemove(checkedTaskId);

    res.redirect("/");
});

app.listen(port, () => {
    console.log(`App started on port ${port}`);
});
