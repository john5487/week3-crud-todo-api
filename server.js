const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());

let todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build Express CRUD API', completed: true },
  { id: 3, task: 'Submit Week 3 Assignment', completed: false }
];



app.get('/todos', (req, res) => {
  res.status(200).json(todos);
});


app.get('/todos/active', (req, res) => {
  const activeTodos = todos.filter(todo => !todo.completed);
  res.status(200).json(activeTodos);
});


app.get('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);

  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  res.status(200).json(todo);
});


app.post('/todos', (req, res) => {
  const { task } = req.body;

  // Validation: Check that 'task' field is present and non-empty
  if (!task || typeof task !== 'string' || task.trim() === '') {
    return res.status(400).json({ error: 'Validation failed: "task" field is required.' });
  }

  const newTodo = {
    id: todos.length > 0 ? todos[todos.length - 1].id + 1 : 1,
    task: task.trim(),
    completed: false
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});


app.put('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);

  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  const { task, completed } = req.body;
  if (task !== undefined) todo.task = task;
  if (completed !== undefined) todo.completed = completed;

  res.status(200).json(todo);
});


app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  todos.splice(index, 1);
  res.status(200).json({ message: 'Todo deleted successfully' });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
