# MongoDB + express

Demo: converting very basic express app (Todos)
from in-memory data storage to MongoDB.

In this case, [the commit diff](https://github.com/vaz/express_mongo_todo_example/commit/ef1e627c77d148b494d11e8f3b12be45f2463ecc)
is worth 1000 words.

Notable things:

- everything to do with "working with data" is kept in the `todos.js` module.
  As far as `app.js` is concerned, the actual data store could be anything.
  We did have to change from regular return values to callbacks, though.
- We make some effort to `db.close()` properly: leaving connections hanging
  isn't a good practice, and it can leave your app hanging when it should
  be shutting down, too.
- I am cheating a little bit by exporting functions in `todos.js` that
  depend on the `db` (which actually takes a moment to connect).
  Since it's a web app, it's *maybe* acceptable that it might not serve requests
  properly for the first few moments, but it's still not 100% correct.

  The 100% correct way would either be a) even more stilted than it is
  now with the async callbacks, or b) use some method like promises
  or generators that I didn't want to get into today.

Also:

- [the lecture notes](https://github.com/vaz/express_mongo_todo_example/blob/754b361b7b3c77afb1f2c2b01bfaa44e76cf8b5b/Lecture-notes.md)
- [mongodb node library docs](https://mongodb.github.io/node-mongodb-native/2.2/)

