let todos = [
    { id: '1', todo: 'First todo', isCompleted: false, createdAt: Date.now() },
    { id: '2', todo: 'Second todo', isCompleted: false, createdAt: Date.now() }
  ];
  
  export default function handler(req, res) {
    if (req.method === 'GET') {
      res.status(200).json(todos);
    } else if (req.method === 'POST') {
      const { todo } = req.body;
      if (!todo || todo.trim() === '') {
        res.status(400).json({ error: 'Todo cannot be empty' });
        return;
      }
      if (todos.some((t) => t.todo === todo)) {
        res.status(400).json({ error: 'Todo already exists' });
        return;
      }
      const newTodo = { id: String(todos.length + 1), todo, isCompleted: false, createdAt: Date.now() };
      todos.push(newTodo);
      res.status(201).json(newTodo);
    }
  }
  