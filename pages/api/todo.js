import { db } from '../../app/firebaseConfig'
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';

let todos = [
  { id: '1', todo: 'First todo', isCompleted: false, createdAt: Date.now() },
  { id: '2', todo: 'Second todo', isCompleted: false, createdAt: Date.now() }
];

async function addTodo(todo) {
  try {
    const docRef = await addDoc(collection(db, "todo"), {
      todo: todo.todo,
      isCompleted: todo.isCompleted,
      createdAt: todo.createdAt
    })
  } catch (e) {
    console.log(e)
  }
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { search } = req.query;
    try {
      const querySnapshot = await getDocs(collection(db, 'todo'));
      const todos = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      let filteredTodos = todos;
      if (search) {
        filteredTodos = todos.filter((todo) =>
          todo.todo.toLowerCase().includes(search.toLowerCase())
        );
      }
      res.status(200).json(filteredTodos);
    } catch (error) {
      console.error('Error fetching todos:', error);
      res.status(500).json({ error: 'Failed to fetch todos' });
    }
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
    const newTodo = { todo, isCompleted: false, createdAt: Date.now() };
    addTodo(newTodo);
    res.status(201).json(newTodo);
  } else if (req.method === 'PUT') {
    const { id } = req.query;
    const { todo: newTodoText, isCompleted } = req.body;

    try {
      const todoRef = doc(db, 'todo', id);
      if (newTodoText) {
        await updateDoc(todoRef, { todo: newTodoText });
      }
      if (isCompleted !== undefined) {
        await updateDoc(todoRef, { isCompleted });
      }
      res.status(200).json({ id, todo: newTodoText, isCompleted });
    } catch (error) {
      console.error('Error updating todo:', error);
      res.status(500).json({ error: 'Failed to update todo' });
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.query;

    try {
      const todoRef = doc(db, 'todo', id);
      const todoSnapshot = await getDoc(todoRef);

      if (!todoSnapshot.exists()) {
        res.status(404).json({ error: 'Todo not found' });
        return;
      }

      await deleteDoc(todoRef);
      res.status(200).json({ id });
    } catch (error) {
      console.error('Error deleting todo:', error);
      res.status(500).json({ error: 'Failed to delete todo' });
    }
  }
}
