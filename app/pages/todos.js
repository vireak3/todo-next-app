import React, { useState, useEffect } from 'react';

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetch('/api/todo')
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((error) => console.error('Error fetching todos:', error));
  }, []);

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!newTodo || newTodo.trim() === '') {
      alert('Todo cannot be empty');
      return;
    }
    if (todos.some((t) => t.todo === newTodo)) {
      alert('Todo already exists');
      return;
    }
    fetch('/api/todo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ todo: newTodo })
    })
      .then((res) => res.json())
      .then((data) => {
        setTodos([...todos, data]);
        setNewTodo('');
      })
      .catch((error) => console.error('Error adding todo:', error));
  };

  return (
    <div>
      <h1>Todo List</h1>
      <form onSubmit={handleAddTodo}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add new todo..."
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.todo}</li>
        ))}
      </ul>
    </div>
  );
}
