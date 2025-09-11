import App from '@/App'
import LoginPage from '@/Auth/login'
import Archive from '@/pages/archive'
import ShowArchive from '@/pages/archive-dails'
import Dashboard from '@/pages/dashboard'
import Delay7 from '@/pages/delay7'
import DelayEnd from '@/pages/delayEnd'
import Allsearch from '@/pages/general_rek'
import GenerelSearchDETAILS from '@/pages/general_rekSearch'
import Map from '@/pages/map'
import AdvertisementDetail from '@/pages/positions'
import StationDetail from '@/pages/station'
import Weekdaitail from '@/pages/weekDetails'
import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{ path: '/', element: <Dashboard /> },
			{ path: '/archive/', element: <Archive /> },
			{ path: '/delay7/', element: <Delay7 /> },
			{ path: '/delaysEnd/', element: <DelayEnd /> },
			{ path: '/map/', element: <Map /> },
			{ path: '/umumiy-qidiruv/', element: <Allsearch /> },
			{ path: '/umumiy-qidiruv/:ida', element: <GenerelSearchDETAILS /> },
			{ path: '/station/:id/', element: <StationDetail /> },
			{
				path: '/station/:id/position/:ids/',
				element: <AdvertisementDetail />,
			},
			{
				path: '/archive-show/:ida/',
				element: <ShowArchive />,
			},
			{
				path: '/kechikishlar/:id',
				element: <Weekdaitail />,
			},
		],
	},
	{ path: '/login', element: <LoginPage /> },
])
