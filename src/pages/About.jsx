import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addTodo, deleteTodo, toggleTodo } from '../redux/Todo/TodoSlice'
import TodoItem from '../components/TodoItem/TodoItem'
import '../styles/About.css'

function About() {
	const dispatch = useDispatch()
	const { list } = useSelector((state) => state.todo)
	const [text, setText] = useState('')

	const handleAdd = () => {
		if (!text.trim()) return
		dispatch(addTodo(text))
		setText('')
	}

	const handleSubmit = (event) => {
		event.preventDefault()
		handleAdd()
	}

	return (
		<div className="todo-container">
			<form className="todo-form" onSubmit={handleSubmit}>
				<input
					type="text"
					className="todo-input"
					placeholder="Enter Task"
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>
				<button className="todo-button" type="submit">
					add Task
				</button>
			</form>
			<ul className="todo-list">
				{list.map((item) => (
					<TodoItem
						key={item.id}
						todo={item}
						onToggle={(id) => dispatch(toggleTodo(id))}
						onDelete={(id) => dispatch(deleteTodo(id))}
					/>
				))}
			</ul>
		</div>
	)
}

export default About