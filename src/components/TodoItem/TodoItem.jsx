function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li className="todo-item">
      <span>{todo.title}</span>
      <div className="todo-actions">
        <button
          className={`todo-status ${todo.completed ? 'completed' : 'pending'}`}
          type="button"
          onClick={() => onToggle(todo.id)}
          aria-label={todo.completed ? 'Mark task as pending' : 'Mark task as completed'}
        >
          {todo.completed ? '✓' : '✗'}
        </button>
        <span className="todo-id">ID: {todo.id}</span>
        <button className="todo-delete" type="button" onClick={() => onDelete(todo.id)}>
          Delete
        </button>
      </div>
    </li>
  )
}

export default TodoItem
