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

app.get("/", async (req, res) => {
    const tasks = await Task.find({});
    if(tasks.length === 0) {
        await Task.insertMany([task, task2]);
        res.redirect("/");
    } else {
        res.render("index.ejs", {taskList: tasks});
    }
});

app.post("/", async(req, res) => {
    const taskName = req.body.task;
    const task = new Task({
        name: taskName
    });
    task.save();

    res.redirect("/");
});

app.listen(port, () => {
    console.log(`App started on port ${port}`);
})
