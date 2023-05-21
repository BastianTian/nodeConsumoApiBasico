const express = require('express');
const axios = require('axios');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Configuración
const flaskHost = 'http://192.168.50.4:5000'; // Cambia esto si el backend Flask se está ejecutando en otro host o puerto
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Middleware
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});
// Obtener todos los libros
app.get('/books', (req, res) => {
  axios.get(`${flaskHost}/books`)
    .then(response => {
      const books = response.data.books;

      // Construir la respuesta en formato HTML
      let int = 0;
      let htmlResponse = '';
      books.forEach(book => {
        int++;
        htmlResponse += `<h2>Libro: ${int}</h2>`;
        htmlResponse += `<p>Id Libro: ${book.id}</p>`;
        htmlResponse += `<p>${book.title}</p>`;
        htmlResponse += `<p>${book.description}</p>`;
        htmlResponse += `<p>${book.author}</p>`;
      });

      // Enviar la respuesta como HTML
      res.send(htmlResponse);
    })
    .catch(error => {
      res.status(500).json({ error: 'Error al obtener los libros' });
    });
});

// Obtener un libro por su id
app.get('/books/:id', (req, res) => {
  const bookId = req.params.id;
  axios.get(`${flaskHost}/books/${bookId}`)
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      res.status(500).json({ error: 'Error al obtener el libro' });
    });
});

// Agregar un nuevo libro
app.post('/books', (req, res) => {
  const { title, description, author } = req.body;
  if (!title || !description || !author) {
    res.status(400).json({ error: 'Todos los campos son requeridos' });
    return;
  }
  axios.post(`${flaskHost}/books`, { title, description, author })
    .then(response => {
      res.status(201).json(response.data);
    })
    .catch(error => {
      res.status(500).json({ error: 'Error al agregar el libro' });
    });
});

// Editar un libro
app.put('/books/:id', (req, res) => {
  const bookId = req.params.id;
  const { title, description, author } = req.body;
  axios.put(`${flaskHost}/books/${bookId}`, { title, description, author })
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      res.status(500).json({ error: 'Error al editar el libro' });
    });
});

// Eliminar un libro
app.delete('/books/:id', (req, res) => {
  const bookId = req.params.id;
  axios.delete(`${flaskHost}/books/${bookId}`)
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      res.status(500).json({ error: 'Error al eliminar el libro' });
    });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor Node.js en ejecución en http://localhost:${port}`);
});