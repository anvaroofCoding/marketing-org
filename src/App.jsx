import { Outlet } from 'react-router-dom'
import Sidebar from './components/sidebar'

const App = () => {
	const tokens = localStorage.getItem('token_marketing')
	if (!tokens) {
		window.location.href = '/login'
	}
	return (
		<div className='flex roboto'>
			<Sidebar />
			<div className='relative w-full h-screen overflow-hidden p-4'>
				{/* Background with pattern */}
				<div
					className="absolute inset-0 
               bg-[url('/naqsh1.jpg')] 
               bg-repeat 
               bg-center 
               bg-[length:100px_100px]  /* naqshni kichraytirish */
               opacity-15           /* naqshning shaffofligi */
               pointer-events-none" /* hover bosishga halal bermaydi */
				/>

				{/* Content */}
				<div className='relative z-10'>
					<Outlet />
				</div>
			</div>
		</div>
	)
}

export default App
