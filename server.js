const express = require('express');
const path = require('path');
const fs = require('fs');
//use npm uuid for random id used
const uuid = require('uuid');
const PORT = process.env.PORT || 3001;
const app = express();

let notes = "";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

fs.readFile('./db/db.json', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
  } else {
 // convert string 
    notes = JSON.parse(data);
  }
});

app.post('/api/notes', (req, res) => {

  console.info(`${req.method} request received to add a note`);


  const { title, text } = req.body;


  if ((title) && (text)) {

    const newNote = {
      title,
      text,
      id: uuid.v4()
    };
 
    notes.push(newNote);

  
    fs.writeFile(
      './db/db.json',
      JSON.stringify(notes, null, 2),
      (writeErr) =>
        writeErr
          ? console.error(writeErr)
          : console.info('Successfully added new note.')
    );
    res.json(notes);
  } else {
    console.error("Something went wrong");
  }
});

app.get('/api/notes', (req, res) => {
  res.json(notes);
});
//delete notes
app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  let note;

  notes.map((deleteNote, index) => {
    if (deleteNote.id == id) {
      note = deleteNote;
      notes.splice(index, 1)
      console.log("Note with Id: " + deleteNote.id + " has been deleted");
      return res.json(note);
    }

  })
});
//retrieve notes.html
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);
//retrieve index.html
app.get('/*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);