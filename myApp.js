require('dotenv').config();
// mongoose@^5.11.15 has been added to your project’s package.json file. First, require mongoose as mongoose in myApp.js. Next, create a .env file and add a MONGO_URI variable to it. Its value should be your MongoDB Atlas database URI. Be sure to surround the URI with single or double quotes, and remember that you can't use spaces around the = in environment variables. For example, MONGO_URI='VALUE'.
// When you are done, connect to the database by calling the connect method within your myApp.js file by using the following syntax:
// mongoose.connect(<Your URI>, { useNewUrlParser: true, useUnifiedTopology: true });
let mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

// First of all, we need a Schema. Each schema maps to a MongoDB collection. It defines the shape of the documents within that collection. Schemas are building blocks for Models. They can be nested to create complex models, but in this case, we'll keep things simple. A model allows you to create instances of your objects, called documents.
// Gitpod is a real server, and in real servers, the interactions with the database happen in handler functions. These functions are executed when some event happens (e.g. someone hits an endpoint on your API). We’ll follow the same approach in these exercises. The done() function is a callback that tells us that we can proceed after completing an asynchronous operation such as inserting, searching, updating, or deleting. It's following the Node convention, and should be called as done(null, data) on success, or done(err) on error.
// Warning - When interacting with remote services, errors may occur!
// /* Example */
// const someFunc = function(done) {
//   //... do something (risky) ...
//   if (error) return done(error);
//   done(null, result);
// };
// Create a person schema called personSchema with the following shape:
// A required name field of type String
// An age field of type Number
// A favoriteFoods field of type [String]
// Use the Mongoose basic schema types. If you want you can also add more fields, use simple validators like required or unique, and set default values. See our Mongoose article.
// Now, create a model from the personSchema and assign it to the existing variable Person.

const Schema = mongoose.Schema;
const personSchema = new Schema({
  name: {type: String, required: true},
  age: Number,
  favoriteFoods: [String]
});

let Person = mongoose.model("Person", personSchema);

// In this challenge you will have to create and save a record of a model.
// Within the createAndSavePerson function, create a document instance using the Person model constructor you built before. Pass to the constructor an object having the fields name, age, and favoriteFoods. Their types must conform to the ones in the personSchema. Then, call the method document.save() on the returned document instance. Pass to it a callback using the Node convention. This is a common pattern; all the following CRUD methods take a callback function like this as the last argument.
// /* Example */
// // ...
// person.save(function(err, data) {
//   //   ...do your stuff here...
// });

const createAndSavePerson = (done) => {
  let anna = new Person({
    name: "Anna",
    age: 34,
    favoriteFoods: ["porks", "steaks", "vegetables"]
  });

  anna.save((err, data) => {
    if (err) return console.error(err);
    done(null, data);
  })
};

// Sometimes you need to create many instances of your models, e.g. when seeding a database with initial data. Model.create() takes an array of objects like [{name: 'John', ...}, {...}, ...] as the first argument, and saves them all in the db.
// Modify the createManyPeople function to create many people using Model.create() with the argument arrayOfPeople.

let arrayOfPeople = [
  {name: "John", age: 23, favoriteFoods: ["vegetables", "snakes", "steaks"]},
  {name: "Joe", age: 33, favoriteFoods: ["vegetables", "mushroom", "steaks"]},
  {name: "Jack", age: 43, favoriteFoods: ["eggs", "snakes", "steaks"]}
]

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, (err, data) => {
    if (err) return console.error(err);
    done(null, data)
  })
};

// In its simplest usage, Model.find() accepts a query document (a JSON object) as the first argument, then a callback. It returns an array of matches. It supports an extremely wide range of search options. Read more in the docs.
// Modify the findPeopleByName function to find all the people having a given name, using Model.find() -> [Person]
// Use the function argument personName as the search key.

const findPeopleByName = (personName, done) => {
  Person.find({name: personName}, (err, data) => {
    if (err) return console.error(err);
    done(null, data)
  })
};

// Model.findOne() behaves like Model.find(), but it returns only one document (not an array), even if there are multiple items. It is especially useful when searching by properties that you have declared as unique.
// Modify the findOneByFood function to find just one person which has a certain food in the person's favorites, using Model.findOne() -> Person. Use the function argument food as search key.

const findOneByFood = (food, done) => {
  Person.findOne({favoriteFoods: food}, (err, data) => {
    if (err) return console.error(err);
    done(null, data)
  })
};

// When saving a document, MongoDB automatically adds the field _id, and set it to a unique alphanumeric key. Searching by _id is an extremely frequent operation, so Mongoose provides a dedicated method for it.
// Modify the findPersonById to find the only person having a given _id, using Model.findById() -> Person. Use the function argument personId as the search key.

const findPersonById = (personId, done) => {
  Person.findById(personId, (err, data) => {
    if (err) return console.error(err);
    done(null, data)
  })
};

// In the good old days, this was what you needed to do if you wanted to edit a document, and be able to use it somehow (e.g. sending it back in a server response). Mongoose has a dedicated updating method: Model.update(). It is bound to the low-level mongo driver. It can bulk-edit many documents matching certain criteria, but it doesn’t send back the updated document, only a 'status' message. Furthermore, it makes model validations difficult, because it just directly calls the mongo driver.
// Modify the findEditThenSave function to find a person by _id (use any of the above methods) with the parameter personId as search key. Add "hamburger" to the list of the person's favoriteFoods (you can use Array.push()). Then - inside the find callback - save() the updated Person.

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";

  Person.findById(personId, (err, data) => {
    if (err) return console.error(err);
    data.favoriteFoods.push(foodToAdd);
    data.save((err, updated) => {
      if (err) return console.error(err);
      done(null, updated);
    })
  })
};

// Recent versions of Mongoose have methods to simplify documents updating. Some more advanced features (i.e. pre/post hooks, validation) behave differently with this approach, so the classic method is still useful in many situations. findByIdAndUpdate() can be used when searching by id.
// Modify the findAndUpdate function to find a person by Name and set the person's age to 20. Use the function parameter personName as the search key.
// Note: You should return the updated document. To do that, you need to pass the options document { new: true } as the 3rd argument to findOneAndUpdate(). By default, these methods return the unmodified object.

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;

  Person.findOneAndUpdate({name: personName}, {age: ageToSet}, {new: true}, (err, data) => {
    if (err) return console.error(err);
    done(null, data)
  })
};

// findByIdAndRemove and findOneAndRemove are like the previous update methods. They pass the removed document to the db. As usual, use the function argument personId as the search key.
// Modify the removeById function to delete one person by the person's _id. You should use one of the methods findByIdAndRemove() or findOneAndRemove().

const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, (err, data) => {
    if (err) return console.error(err);
    done(null, data)
  })
};

// Model.remove() is useful to delete all the documents matching given criteria.
// Modify the removeManyPeople function to delete all the people whose name is within the variable nameToRemove, using Model.remove(). Pass it to a query document with the name field set, and a callback.
// Note: The Model.remove() doesn’t return the deleted document, but a JSON object containing the outcome of the operation, and the number of items affected. Don’t forget to pass it to the done() callback, since we use it in tests.

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";

  Person.remove({name: nameToRemove}, (err, data) => {
    if (err) return console.error(err);
    done(null, data)
  })
};

// If you don’t pass the callback as the last argument to Model.find() (or to the other search methods), the query is not executed. You can store the query in a variable for later use. This kind of object enables you to build up a query using chaining syntax. The actual db search is executed when you finally chain the method .exec(). You always need to pass your callback to this last method. There are many query helpers, here we'll use the most commonly used.
// Modify the queryChain function to find people who like the food specified by the variable named foodToSearch. Sort them by name, limit the results to two documents, and hide their age. Chain .find(), .sort(), .limit(), .select(), and then .exec(). Pass the done(err, data) callback to exec().

const queryChain = (done) => {
  const foodToSearch = "burrito";

  Person.find({favoriteFoods: foodToSearch})
        .sort({name: 1})
        .limit(2)
        .select({age: 0})
        .exec((err, data) => {
          if (err) return console.error(err);
          done(null, data)
        })
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
