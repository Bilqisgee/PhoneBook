const express = require("express");
const morgan = require("morgan")
const {v4: uuidv4} = require('uuid') // import uuid for  unique ID generation
  const cors = require("cors")
const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cors())

// hardcorede data for phonebook
let persons = [
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" },
  { id: "5", name: "Johnson Peter", number: "39-23-6908422" },
];

// Create a custom token to log request body
morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ""
});

// Set up morgan to use a custom format which logs method, URL, status, response time, and body (only for POST requests)
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'));

// Sample route for testing
app.post('/test', (req, res) => {
  res.send('Received a POST request');
});




// POST add a new person
app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;

  //validate the req.body
  if (!name || !number) {
    return res.status(404).json({ error: "Name and Number are required" });
  }

  const existingPerson = persons.find((person) => person.name === name);
  if (existingPerson) {
    return res.status(409).json({ error: "name must be unique" });
  }
// generate a new id
  const id = uuidv4()

  const newPerson = { id, name, number };
  persons.push(newPerson); // add the new person to the array

  // Respond with the created person and a 201 status
  res.status(201).json(newPerson);
});

// delete a person
app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id; // selecting a person
  const initialLenght = persons.length; // new array
  persons = persons.filter((p) => p.id !== id);

  if (persons.length < initialLenght) {
    res.status(204).end();
  } else {
    res.status(404).json({ error: "person not found" });
  }
});

// Route to get information of a single person by id
app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id; // extract id from request parameters
  const person = persons.find((p) => p.id === id); // find person by id

  if (person) {
    res.json(person); // if person exist send their data
  } else {
    res.status(404).json({ error: "Person not found" });
  }
});

// Info route to display number of persons and request time
app.get("/info", (req, res) => {
  const entriesCount = persons.length;
  const requestTime = new Date();
  res.send(
    `<p>Phonebook has info for ${entriesCount}</p>
    <p>Request recieved at ${requestTime}</p>`
  );
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

// app.listen(3001)
