import React, { useState, useEffect, useRef } from 'react';

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

    // Ref for the edit input
    const editInputRef = useRef(null);

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

    // useEffect to focus the edit input when the edit form is opened
    useEffect(() => {
      if (editForm && editInputRef.current) {
        editInputRef.current.focus();
      }
    }, [editForm]);

  // JSX for the todo app

  return (
    <div>

        <div className='form'>
          <form autoComplete='off' onSubmit={handleSubmit}>
            <div className='input-and-button'>
              <input
                type='text'
                placeholder="I'll do...."
                required
                onChange={(e) => setTodoValue(e.target.value)}
                value={editForm ? '' : todoValue}
              />
              <div className='button'>
                <button type='submit'>Add</button>
              </div>
            </div>
          </form>
        </div>

        {todos.length > 0 && (
          <div>
            {todos.map((individualTodo, index) => (
              <div className='todo' key={individualTodo.ID}>
                {!editForm || id !== index ? (
                  // Render todo item when edit form is not open or this todo is not being edited
                  <div className='todo-child' onDoubleClick={() => handleEdit(individualTodo, index)}>
                    <input
                      type='checkbox'
                      checked={individualTodo.completed}
                      onChange={() => handleToggleComplete(individualTodo.ID)}
                      className='checkbox'
                    />
                    <span>{individualTodo.TodoValue}</span>
                  </div>
                ) : (
                  // Render edit form when edit form is open and this todo is being edited
                  <form autoComplete='off' onSubmit={handleEditSubmit}>
                    <input
                      type='text'
                      placeholder='Instead...'
                      required
                      onChange={(e) => setTodoValue(e.target.value)}
                      value={todoValue}
                      className='edit-input'
                      ref={editInputRef}
                    />
                    <button type='submit-edit'>Update</button>
                  </form>
                )}
              </div>
            ))}

            <div className='delete-completed'>
              {todos.length > 0 && (
                <button
                  onClick={() => {
                    const newTodos = todos.filter((todo) => !todo.completed);
                    setTodos(newTodos);
                    setCompletedTodos([]);
                  }}
                >
                  Clear Completed
                </button>
              )}
            </div>
          </div>
        )}
    </div>
  )
}

export default TodoApp;
