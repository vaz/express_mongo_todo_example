// this acts as our in-memory database:
const data = {
  todos: require('./todos-data') // loads json from todos-data.json
}

// We'll export this object, which provides the
// functions for interacting with the in-memory data.
const Todos = {};
module.exports = Todos;

// helper: generate next id (auto-incrementing number)
const nextId = () => {
  return data.todos.reduce((highest, todo) => todo.id > highest ? todo.id : highest, 0) + 1;
}

Todos.all = function all () {
  // return all objects in the todos array
  return data.todos;
};

Todos.create = function create (todo) {
  return data.todos.push(todo);
};

Todos.destroy = function destroy (id) {
  var found = data.todos.findIndex(todo => todo._id === id)
  if (!found) {
    throw new Error(`No todo with id ${id}`);
  }
  data.todos.splice(found, 1);
};

