const mongoose = require("mongoose");

const dbName = 'fruitsDB';
mongoose.connect(`mongodb://localhost:27017/${dbName}`, { useNewUrlParser: true });

// Schema??
const fruitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "The fruit has a name, right? Input it!"]
  },
  rating: {
    type: Number,
    min: 0,
    max: 10
  },
  review: String      
});

// "Collection"
const Fruit = mongoose.model("Fruit", fruitSchema);

// "Document"
const fruit = new Fruit({
  name: "Breach",
  rating: 0.0,
  review: "Personagem mais desgra,cado do jogo. (Sim, n~ao [e fruta)"
});

fruit.save();

const abacaba = new Fruit({
  name: "Abacaba",
  rating: 10.0,
  review: "It is 10 just because of the meme"
});

const taperaba = new Fruit({
  name: "Taperab`a",
  rating: 9.0,
  review: "Perhaps I have never ate this fruit before"
});

const tucuma = new Fruit({
  name: "Tucum~a",
  rating: 10.0,
  review: "This one is a real 10."
});

// Create
Fruit.insertMany(
  [abacaba, taperaba, tucuma], 
  function(err) {
    if (err) {
      console.log("Error: ", err);                  
    } else {
      console.log("Sucessfully inserted many fruits.");
    }
  }
);

// Read
Fruit.find(function(err, fruits) {
  if (err) {
    console.log("Error => ", err);
  } else {
    console.log("Fruits found!");
    fruits.forEach(fruit => console.log(fruit.name));
  }
});

// Update
Fruit.updateOne(
  { name: "Breach" }, 
  { name: "Manga", review: "Ok" }, 
  function (err, _) {
    if (err) {
      console.log("Error => ", err);
    } else {
      console.log("Update the breach!");
    }
    // mongoose.connection.close();
  }
);

// Delete
Fruit.deleteOne(
  { name: "Manga" },
  function (err) {   
    if (err) {
      console.log("Error => ", err);
    } else {
      console.log(`Sucessfully deteted the first manga.`);
    }
    // mongoose.connection.close();
  }
);

Fruit.deleteMany({rating: {$gte: 5.0}}, function(err) {
  if (err) {
    console.log("Many Error =>", err);
  } else {
    console.log("Successfully deleted many entries");
  }
});

const personSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    min: 18,
    max: 99
  },
  favouriteFruit: fruitSchema
});

const Person = mongoose.model('Person', personSchema);

const person = new Person({
  name: "Carl",
  age: 32,
  favouriteFruit: abacaba
});

// person.save();

Person.updateOne({name: "Jovito"}, {favouriteFruit: taperaba}, function(err, _) {
  if (err) {
    console.log(err);
  } else {
    console.log("Sucessfully update jovito favourite fruit");
  }
});