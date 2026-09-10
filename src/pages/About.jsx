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
		<main className="todo-page">
			<div className="todo-intro">
				<p className="todo-kicker">Personal board</p>
				<h1>Задачи на сегодня</h1>
				<p>Небольшой список дел, который не требует лишнего шума.</p>
			</div>
			<div className="todo-container">
				<div className="todo-heading">
					<h2>Мой список</h2>
					<span>{list.length} задач</span>
				</div>
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
		</main>
	)
}

export default About