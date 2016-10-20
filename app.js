"use strict"
const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

// the todos module wraps how we interact with the database
const Todos = require('./todos');

const app = express();
const PORT = process.env.PORT || 8080;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded());
app.use(methodOverride("_method"));


// Just so home page doesn't 404
app.get('/', (req, res) => {
  res.redirect('/todos');
});

// Fetch from Mongo all todos
app.get("/todos", (req, res) => {
  // todos.all returns array of all todos in the callback
  const allTodos = Todos.all();
  res.render("todos/index", { todos: allTodos });
});

// Form to create new todo
app.get("/todos/new", (req, res) => {
  res.render("todos/new");
});

// Create new todo in Mongo
app.post("/todos", (req, res) => {
  const todo = { desc: req.body.desc, completed: false };
  Todos.create(todo);
  res.redirect("/todos");
});

// Delete by (mongo) ID
app.delete("/todos/:id", (req, res) => {
  const id = req.params.id;
  try {
    Todos.destroy(id);
  }
  catch (e) {
    console.error(e);
  }
  res.redirect("/todos");
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

