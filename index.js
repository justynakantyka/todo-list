import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const privateTaskList = [];
const workTaskList = [];

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("private.ejs", {privateTaskList: privateTaskList});
});

app.get("/work", (req, res) => {
    res.render("work.ejs", {workTaskList: workTaskList});
})

app.post("/", (req, res) => {
    privateTaskList.push(req.body["task"]);
    res.render("private.ejs", {privateTaskList: privateTaskList});
})

app.post("/work", (req, res) => {
    workTaskList.push(req.body["task"]);
    res.render("work.ejs", {workTaskList: workTaskList});
})

app.listen(port, () => {
    console.log(`App started on port ${port}`);
})