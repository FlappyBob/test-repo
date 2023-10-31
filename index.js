const express = require("express");
const app = express();
const cors = require('cors')

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2022-05-30T17:30:31.098Z",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2022-05-30T18:39:34.091Z",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2022-05-30T19:20:14.298Z",
    important: true,
  },
];
app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
app.use((res, req, next) => {
  console.log('method: ', res.method)
  console.log('body: ', res.body)
  console.log('path: ', res.path)
  console.log('---')
  next()
})

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/api/note", (req, res) => {
  res.end(JSON.stringify(notes));
});

app.get("/api/note/:id", (req, res) => {
  const id = Number(req.params.id);
  const note = notes.find((note) => note.id === id);

  if (note) {
    res.json(note);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/note/:id", (req, res) => {
  const id = Number(req.params.id);
  notes = notes.filter((note) => note.id !== id);
  res.status(204).end();
});

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.post("/api/note", (request, response) => {
  const body = request.body;

  if (!body) {
    return response.status(400).json({
      error: "body missing",
    });
  }

  if (!body.content) {
    return response.status(400).send({
      error: "body missing",
    });
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  };

  notes = notes.concat(note);

  response.json(note);
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
