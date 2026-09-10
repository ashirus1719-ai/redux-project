import { NavLink } from 'react-router-dom'
import './Header.css'

function Header() {
	return (
		<header>
			<NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
				Home
			</NavLink>
			<NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>
				About
			</NavLink>
			<NavLink to="/message" className={({ isActive }) => (isActive ? 'active' : '')}>
				Товары
			</NavLink>
		</header>
	)
}

export default Header