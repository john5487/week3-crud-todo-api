const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// In-memory storage
let todos = [];
let nextId = 1;

// ---------- FIXED: ROOT ROUTE (GET /) ----------
// This solves the "Cannot GET /" error. If you visit http://localhost:3000, 
// it will now automatically redirect your browser to /todos.
app.get('/', (req, res) => {
  res.redirect('/todos');
});

// ---------- CREATE (POST /todos) ----------
app.post('/todos', (req, res) => {
  const { task } = req.body;

  if (!task || task.trim() === '') {
    return res.status(400).json({ error: 'The "task" field is required.' });
  }

  const newTodo = {
    id: nextId++,
    task: task.trim(),
    completed: false
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// ---------- READ all (GET /todos) ----------
app.get('/todos', (req, res) => {
  res.json(todos);
});

// ---------- READ active (GET /todos/active) ----------
app.get('/todos/active', (req, res) => {
  const active = todos.filter(todo => !todo.completed);
  res.json(active);
});

// ---------- READ one (GET /todos/:id) ----------
app.get('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  const todo = todos.find(t => t.id === id);
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  res.json(todo);
});

// ---------- UPDATE (PUT /todos/:id) ----------
app.put('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  const todo = todos.find(t => t.id === id);
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  const { task, completed } = req.body;
  if (task !== undefined) {
    if (task.trim() === '') return res.status(400).json({ error: 'Task cannot be empty' });
    todo.task = task.trim();
  }
  if (completed !== undefined) {
    if (typeof completed !== 'boolean') return res.status(400).json({ error: 'Completed must be a boolean' });
    todo.completed = completed;
  }
  res.json(todo);
});

// ---------- DELETE (DELETE /todos/:id) ----------
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  const index = todos.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  todos.splice(index, 1);
  res.status(204).send();
});

// ---------- FIXED: CLEARER TERMINAL LOGS ----------
app.listen(port, () => {
  console.log(`✅ Todo API successfully running!`);
  console.log(`TTodo Api running at : http://localhost:${port}/todos`);
  console.log('\nAvailable API Routes:');
  console.log('  GET    /todos         (View all todos)');
  console.log('  GET    /todos/active  (View unfinished todos)');
  console.log('  GET    /todos/:id     (View one todo by ID)');
  console.log('  POST   /todos         (Create a todo)');
  console.log('  PUT    /todos/:id     (Update a todo)');
  console.log('  DELETE /todos/:id     (Delete a todo)');
});