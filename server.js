const express = require('express');
const path = require('path');
const { nanoid } = require('nanoid');
const { readFromFile, readAndAppend, readAndDelete } = require('./helpers/fsUtils');

// sets PORT to either be usable by another server process OR to 3001 for localhost
const PORT = process.env.PORT || 3001;

// create the express server object and call it app
const app = express();

// middleware for using json with the express server
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// home route - takes you to the index
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// notes route - takes you to the notes.html
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// api notes GET route - reads and displays the json data in db.json
app.get('/api/notes', (req, res) =>
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
);

// api notes POST route - saves the note to db.json
app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;

    console.info(`${req.method} request received to add a note`);

    if (req.body) {
        const newNote = {
            title,
            text,
            id: nanoid(),
        };

        readAndAppend(newNote, './db/db.json');
        res.json();
    }
});

// api notes DELETE route - takes a query result and deletes any notes from db.json with matching id
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;

    console.info(`${req.method} request received to delete a note with id of ${req.params.id}`);
    
    readAndDelete('./db/db.json', noteId);
    res.json();
});

// any other non-secified route will return index.html
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// call the express server to listen at specific port
app.listen(PORT, () => 
    console.log(`App listening at http://localhost:${PORT}`)
);