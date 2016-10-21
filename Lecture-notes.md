# Persistence with MongoDB

## What is persistence?

**Persistent data** is data that outlives the process that created it.

Data stored in memory (in variables, within a running program) is
temporary: when the process exits, the memory is released, and the
data is forgotten.

In practice, persisting data means writing data to a hard disk drive
(long-term storage).

## Persistent storage

Data can be stored in lots of different ways.  Often, a method of persisting
data will be good for some use cases, and bad for many others.

### Text files

Plain text files can be used to store data. By "plain text", I mean
it's not a binary format, though it's still structured in some way.

#### CSV: comma-separated values

CSV is a very simple format. Example speaks for itself:

```csv
id,name,email,favourite_food
1,Vaz,vaz@vaz.com,"olives, no wait, basil... does that count as food?"
2,Sy,sy@sy.com,"grapefruit juice"
3,Khurram,k@v.com,"I have no idea"
```

CSV is a plain-text equivalent to MS Excel/OpenOffice Calc spreadsheets.
It represents a table with rows and columns.

- pro: simple to code reader/writer
- pro: understood by non-programmers
- pro: Excel/Calc can turn spreadsheets into CSV
- con: everything else. No nesting, everything is a string (you have
  to interpret data types yourself), no indexing (you have to search
  sequentially through it).
- con: CSV is 100% not-ACID-at-all

Moving on...

#### JSON: JavaScript Object Notation

We see JSON a lot already. It's the de facto language of data interchange
for web APIs nowadays.

JSON as a persistent data store means JSON written to files.

- pro: structured, nested objects, data types
- pro: easy to read/write in code
- con: you're still left to code all the operations on the data
  yourself.
- con: unwieldy/slow for large amounts of data
- con: no ACID-compliance unless you write code that is ACID-compliant

JSON is great. It's great for static site data and content, for
seeding databases with initial values, for storing configuration, etc.
But as long-term storage of serious data, it's not powerful enough.

#### Operations on in-memory databases (objects, arrays)

We looked at a bit at what some common operations look like
when the database is in-memory.

Example database:

```
const data = {
  users: [
    { name: "Vaz", age: 1000 },
    { name: "Someone else", age: 25 },
    ...
  ]
}
```

##### find all

```
data.users
```

##### find with query

```
data.users.filter(user => user.age > 18)
```

##### insert

```
data.users.push(newUser)
```

##### delete by id

```
data.users.splice(data.users.findIndex(user => user.id === id), 1)
```

Etc...

## Databases

Databases offer persistent storage, robust mechanisms for interacting
with the data, and other benefits like atomic updates, indexing for
quick retrieval, etc. It varies depending on the database.

The word "database" could technically apply very broadly, but
usually we're talking about the kind of thing you'd see here:

http://db-engines.com/en/ranking

Note the different "Database Model" values. Relational is
pretty popular: it's very similar to the spreadsheet/CSV model,
except way more powerful and robust.

On the other hand, storing complex/nested data structures
can be a lot more complicated in a relational (table-based)
database.

We're going to be working with MongoDB, which is a "Document Store"
database.

### MongoDB

- https://docs.mongodb.com/manual/

MongoDB is a "document storage" database engine, meaning it models
data as "documents".

A MongoDb Document is a BSON object. BSON is like JSON but with
a few differences. A few of them:

- BSON is part of a binary protocol of data interchange.
  Mostly this is invisible to you, but it means things like
  compression of data for faster speeds and reduced disk space
  requirements (compared to plain text JSON).

- BSON objects (or Documents, it's interchangeable) that are
  stored in MongoDB always have an `_id` field.

- BSON objects are inherently ordered, JSON (and JS) objects
  are not. BSON objects can have the same key multiple times,
  JSON (and JS) objects can not.

Example of a couple of BSON documents in an array:

```bson
[
{ "_id" : ObjectId("5809766781ae5ebe45364821"), "name" : "CSV", "coolness" : 0.5 },
{ "_id" : ObjectId("5809766781ae5ebe45364822"), "name" : "MongoDB", "coolness" : 9001 }
]
```

#### Documents, Collections, Databases

- documents belong to collections
- collections belong to databases
- a mongoDB server can host many databses
- alternatively, a database could be hosted by many mongoDB servers
  (advanced topics: sharding, replication)

#### Client/server

MongoDB runs as a server process (`mongod`), and specifies a protocol
for clients to talk to the server and do things with the data.

MongoDB databases are specified by URLs, just like HTTP web
servers. But it's not HTTP, the protocol is the `mongodb`
protocol. Example: `mongodb://localhost:27017/some_database`

Like how HTTP clients can be anything from web browsers to
`curl` to other programs, MongoDB clients come in many forms.

- `mongo` shell
- library support for lots of programming languages
  - npm package: `mongodb`

#### `mongo` shell

https://docs.mongodb.com/manual/mongo/

The mongo shell is kind of like interactive node... the language
is JavaScript! (Plus a few extra commands.)

Interesting commands:

- `help` (also `db.help()`, `db.somecollection.help()`, etc)
- `show dbs`
- `use <db>`
- `show collections` (in the db you're currently using)

CRUD operations:

https://docs.mongodb.com/manual/crud/

##### Insert a document

```
db.things.insert({ value: 5 })
db.things.insert([{ value: 65 }, { value: 546 }])
```

##### Find all, or some, documents in collection

```
db.things.find()
db.things.find({ value: 5 })
db.things.find({ value: { $gt: 100 }}) // find all with value > 100
db.things.find().limit(2);
```

See [Query Documents](https://docs.mongodb.com/manual/tutorial/query-documents/)

##### Update documents

```
db.things.updateOne({ value: 5 }, { $set: { value: 555 }})
```

See [Update Documents](https://docs.mongodb.com/manual/tutorial/update-documents/)

##### Deleting documents

```
db.things.deleteOne({ value: 555 })
db.things.deleteMany({ value: { $lt: 100 }}) // delete where value > 200
```

See [Delete Documents](https://docs.mongodb.com/manual/tutorial/remove-documents/)

There's a lot more, but we don't need to get too deep into it for now.

#### `mongodb` in node

The npm package `mongodb` provides library support for working with MongoDB
from a node app.

See [the demo repo](https://github.com/vaz/express_mongo_todo_example)
where we converted an express app to use MongoDB.

- Most interestingly, [see the commit diff](https://github.com/vaz/express_mongo_todo_example/commit/ef1e627c77d148b494d11e8f3b12be45f2463ecc)
- [mongodb node library docs](https://mongodb.github.io/node-mongodb-native/2.2/)

