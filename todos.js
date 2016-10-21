const mongodb     = require("mongodb")
const MongoClient = mongodb.MongoClient;
const ObjectId    = mongodb.ObjectId;
const MONGODB_URI = "mongodb://localhost:27017/todo_app";


// We'll export this object. Its functions are defined
// in the callback below where the db connection is
// open and in scope.
const Todos = {};
module.exports = Todos;

MongoClient.connect(MONGODB_URI, (err, db) => {
  if (err) {
    return console.error(err.stack);
  }

  // The "todos" collection in the "todo_app" database.
  // compare with `db.todos` in mongo shell
  const todosCollection = db.collection('todos');

  Todos.all = function all (cb) {
    // find({}) will return all documents in "todos" collection
    return todosCollection.find({}).toArray(cb);
  };

  Todos.create = function create (todo, cb) {
    return todosCollection.insert(todo, cb);
  };

  Todos.destroy = function destroy (id, cb) {
    // you have to wrap the plain number id as an ObjectId
    // for it to match:
    const _id = ObjectId(id);
    return todosCollection.deleteOne({ _id: _id }, cb);
  };

  // shutdown gracefully: close the db connection safely
  const closeConnection = function () {
    console.log("Closing db connection.");
    try {
      db.close();
    }
    catch (e) {
      console.error("Error while shutting down:", e.stack);
    }
    console.log("Bye!");
    process.exit();
  };

  // Signal handlers make sure to call closeConnection before
  // exiting
  //
  // INT signal, e.g. Ctrl-C
  process.on('SIGINT', closeConnection);
  // TERM signal, e.g. kill
  process.on('SIGTERM', closeConnection);

});
