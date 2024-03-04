let todos = [
  { id: '1', todo: 'First todo', isCompleted: false, createdAt: Date.now() },
  { id: '2', todo: 'Second todo', isCompleted: false, createdAt: Date.now() }
];

export default function handler(req, res) {
  if (req.method === 'GET') {
    const { search } = req.query;
    let filteredTodos = todos;
    if (search) {
      filteredTodos = todos.filter((todo) => todo.todo.toLowerCase().includes(search.toLowerCase()));
    }
    res.status(200).json(filteredTodos);
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
  } else if (req.method === 'PUT') {
    const { id } = req.query;
    const todoIndex = todos.findIndex((t) => t.id === id);
    if (todoIndex === -1) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }
    if(req.body.todo){
      const { todo: newTodoText } = req.body;
      todos[todoIndex] = { ...todos[todoIndex], todo: newTodoText };
    } else if(req.body.isCompleted != null){
      const { isCompleted: status } = req.body;
      console.log(status)
      todos[todoIndex] = { ...todos[todoIndex], isCompleted: status };
    } 
    // console.log({todos})
    res.status(200).json(todos[todoIndex]);
  } else if (req.method === 'DELETE') {
    const { id } = req.query;
    const todoIndex = todos.findIndex((t) => t.id === id);
    if (todoIndex === -1) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }
    const removedTodo = todos.splice(todoIndex, 1)[0];
    res.status(200).json(removedTodo);
  }
}
