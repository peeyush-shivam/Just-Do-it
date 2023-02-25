import React, { useState, useEffect } from 'react';

const TodoApp = () => {
  // This function retrieves todos from local storage
  const getTodosFromLS = () => {
    const data = localStorage.getItem('Todos');
    if (data) {
      return JSON.parse(data);
    } else {
      return [];
    }
  };

  // State variables for the todo app
  const [todoValue, setTodoValue] = useState('');
  const [todos, setTodos] = useState(getTodosFromLS());
  const [completedTodos, setCompletedTodos] = useState([]);
  const [editForm, setEditForm] = useState(false);
  const [id, setId] = useState();

  // Function to handle form submission for adding a todo
  const handleSubmit = (e) => {
    e.preventDefault();
    const date = new Date();
    const time = date.getTime();
    const todoObject = {
      ID: time,
      TodoValue: todoValue,
      completed: false,
    };
    setTodos([...todos, todoObject]);
    setTodoValue('');
  };

  // useEffect to update local storage when todos change
  useEffect(() => {
    localStorage.setItem('Todos', JSON.stringify(todos));
  }, [todos]);

  // Function to handle editing a todo
  const handleEdit = (todo, index) => {
    setEditForm(true);
    setId(index);
    setTodoValue(todo.TodoValue);
  };

  // Function to handle toggling the completed status of a todo
  const handleToggleComplete = (id) => {
    const index = todos.findIndex((todo) => todo.ID === id);
    const newTodos = [...todos];
    newTodos[index].completed = !newTodos[index].completed;
    setTodos(newTodos);
    if (newTodos[index].completed) {
      const completedTodo = newTodos[index];
      setCompletedTodos([...completedTodos, completedTodo]);
    } else {
      const filteredCompleted = completedTodos.filter((todo) => todo.ID !== id);
      setCompletedTodos(filteredCompleted);
    }
  };

  // Function to handle submitting an edit to a todo
  const handleEditSubmit = (e) => {
    e.preventDefault();
    let items = [...todos];
    let item = items[id];
    item.TodoValue = todoValue;
    items[id] = item;
    setTodos(items);
    setTodoValue('');
    setEditForm(false);
  };

  // JSX for the todo app

  return (
    <div>
      {editForm === false && (
        <div className='form'>
          <form autoComplete='off' onSubmit={handleSubmit}>
            <div className='input-and-button'>
              <input
                type='text'
                placeholder='Start adding tasks'
                required
                onChange={(e) => setTodoValue(e.target.value)}
                value={todoValue}
              />
              <div className='button'>
                <button type='submit'>Add</button>
              </div>
            </div>
          </form>
        </div>
      )}

      {editForm === true && (
        <div className='form'>
          <form autoComplete='off' onSubmit={handleEditSubmit}>
            <input
              type='text'
              placeholder='Add an Item'
              required
              onChange={(e) => setTodoValue(e.target.value)}
              value={todoValue}
              className='edit-input'
            />
            <button type='submit'>Update</button>
          </form>
        </div>
      )}

      {todos.length > 0 && (
        <div>
          {todos.map((individualTodo, index) => (
            <div className='todo' key={individualTodo.ID} onDoubleClick={() => handleEdit(individualTodo, index)}>
              <div className='todo-child'>
                <input
                  type='checkbox'
                  checked={individualTodo.completed}
                  onChange={() => handleToggleComplete(individualTodo.ID)}
                  className='checkbox'
                />
                <span>{individualTodo.TodoValue}</span>
              </div>
          </div>
          ))}

              <div className='delete-completed'>
                { todos.length > 0 
                  && <button onClick={() => {
                      const newTodos = todos.filter((todo) => !todo.completed);
                      setTodos(newTodos);
                      setCompletedTodos([]);
                        }}>
                        Clear Completed
                    </button> 
                }
              </div>
        </div>
      )}
    </div>
    )
}

export default TodoApp;