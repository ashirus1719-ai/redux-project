import '../styles/NotFound.css'
import { Link } from 'react-router-dom'

function NotFound() {
	return (
		<div className="not-found">
			<h1 className="not-found-title">404 - Page Not Found</h1>
			<p className="not-found-message">The page you are looking for does not exist.</p>
			<Link className="not-found-link" to="/">Вернуться на главную</Link>
		</div>
	)
}

export default NotFound
