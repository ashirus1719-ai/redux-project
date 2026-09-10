import './Footer.css'

function Footer() {
	return (
		<footer>
			<span>Pizza / Lab</span>
			<span>Собираем меню с вниманием к деталям</span>
			<span>{new Date().getFullYear()}</span>
		</footer>
	)
}

export default Footer
