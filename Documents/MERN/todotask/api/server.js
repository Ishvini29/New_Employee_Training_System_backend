const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//send the input with url
app.use(express.urlencoded({ extended: false }));

//connecting database  mongodb+srv://sagini:Sagini18@sagini.1bkss7a.mongodb.net/
mongoose.set("strictQuery", false);
mongoose
  .connect("mongodb+srv://sagini:Sagini18@sagini.1bkss7a.mongodb.net/ToDoList")
  .then(() => console.log("DB is connected successfully"))
  .catch((error) => console.log(error));

// import model -class
const ToDo = require("./models/Todo");
const { urlencoded } = require("express");

// http://localhost:8080/todos
app.get("/todos", async (req, res) => {
  res.json(await ToDo.find());
});

// http://localhost:8080/todo/new {text}
app.post("/todo/new", (req, res) => {
  //create object - instances
  const todo = new ToDo({
    text: req.body.text,
  });
  todo.save();
  res.json(todo);
});

// http://localhost:8080/todo/delete/:id
app.delete("/todo/delete/:id", async (req, res) => {
  const result = await ToDo.findByIdAndDelete(req.params.id);
  res.json(result);
});

// http://localhost:8080/todo/complete/:id
app.get("/todo/complete/:id", async (req, res) => {
  const todoCom = await ToDo.findById(req.params.id);

  todoCom.complete = !todoCom.complete;
  todoCom.save();

  res.json(todoCom);
});

app.listen(8080, () => console.log("Server is started on port 8080"));
