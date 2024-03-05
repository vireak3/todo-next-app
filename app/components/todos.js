"use client"

import React, { useState, useEffect, useRef } from 'react';
import styles from './todos.module.css'; // Import CSS module

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editTodoId, setEditTodoId] = useState(null);
  const [editTodoText, setEditTodoText] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    fetch('/api/todo')
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((error) => console.error('Error fetching todos:', error));
  }, []);

  useEffect(() => {
    fetch(`/api/todo?search=${newTodo}`)
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((error) => console.error('Error fetching todos:', error));
  }, [newTodo])

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

  const handleRemoveTodo = (id) => {
    fetch(`/api/todo?id=${id}`, {
      method: 'DELETE'
    })
      .then(() => {
        setTodos(todos.filter((todo) => todo.id !== id));
      })
      .catch((error) => console.error('Error removing todo:', error));
  };

  const handleEditTodo = (id, text) => {
    inputRef.current.focus();
    setEditTodoId(id);
    setEditTodoText(text);
  };

  const handleUpdateTodo = (id, newText) => {
    fetch(`/api/todo?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ todo: newText })
    })
      .then(() => {
        setTodos(todos.map((todo) => (todo.id === id ? { ...todo, todo: newText } : todo)));
        setEditTodoId(null);
        setEditTodoText('');
      })
      .catch((error) => console.error('Error updating todo:', error));
  };

  const handleUpdateTodoStatus = (id, status) => {
    fetch(`/api/todo?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ isCompleted: status })
    })
      .then(() => {
        setTodos(todos.map((todo) => (todo.id === id ? { ...todo, isCompleted: status } : todo)));
      })
      .catch((error) => console.error('Error updating todo:', error));
  };

  return (
    <div className='w-[650px]'>
      <h1>Todo List</h1>
      <p>press enter when add or update todo.<br/>hover on todo list to do actions.</p>
      {/* <form onSubmit={handleAddTodo}> */}
      <input
        type="text"
        ref={inputRef}
        value={editTodoText ? editTodoText : newTodo}
        onChange={(e) => {
          editTodoId ?
            setEditTodoText(e.target.value)
            :
            setNewTodo(e.target.value)
        }}
        placeholder="Add new todo..."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (editTodoId && editTodoText) {
              handleUpdateTodo(editTodoId, editTodoText)
              return
            }
            else
              handleAddTodo(e)
          }
        }}
      />

      {/* </form> */}
      <ul>
        {todos.length === 0 ? "No result. Create a new one instead!" : todos.map((todo) => (
          <li key={todo.id} className={styles.todoItem}>

            <div>
              {/* {editTodoId === todo.id ? (
                <input
                  type="text"
                  value={editTodoText}
                  onChange={(e) => setEditTodoText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUpdateTodo(todo.id, editTodoText);
                    }
                  }}
                />
              ) : ( */}
              <>
                {todo.isCompleted ? <s>{todo.todo}</s> : todo.todo}
                <button className={styles.editButton} onClick={() => handleEditTodo(todo.id, todo.todo)}>
                  Edit
                </button>
                <button className={styles.completeButton} onClick={() => handleUpdateTodoStatus(todo.id, true)}>
                  Mark as Complete
                </button>
                <button className={styles.inCompleteButton} onClick={() => handleUpdateTodoStatus(todo.id, false)}>
                  Mark as Incomplete
                </button>
                <button className={styles.removeButton} onClick={() => handleRemoveTodo(todo.id)}>
                  Remove
                </button>
              </>
              {/* // )} */}
            </div>

          </li>
        ))}
      </ul>
    </div>
  );
}
