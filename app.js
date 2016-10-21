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
  Todos.all((err, allTodos) => {
    res.render("todos/index", { todos: allTodos });
  });
});

// Form to create new todo
app.get("/todos/new", (req, res) => {
  res.render("todos/new");
});

// Create new todo in Mongo
app.post("/todos", (req, res) => {
  const todo = { desc: req.body.desc, completed: false };
  Todos.create(todo, (err, result) => {
    if (err) {
      console.error(err);
    }
    res.redirect("/todos");
  })
});

// Delete by (mongo) ID
app.delete("/todos/:id", (req, res) => {
  const id = req.params.id;

  Todos.destroy(id, (err, result) => {
    if (err) {
      console.error(err);
    }
    res.redirect("/todos");
  });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

