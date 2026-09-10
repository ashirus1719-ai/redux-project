import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import { Outlet } from 'react-router-dom'

function Layout() {
	return (
		<div id='main'>
				<Header />
					<div id='second-main'>
							<Outlet />
					</div>
				<Footer />
		</div>
	)
}

export default Layout
