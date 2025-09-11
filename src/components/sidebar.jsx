import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useGetTimeQuery } from '@/services/api'
import {
	Archive,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	Clock,
	LogOut,
	Map,
	Search,
	User,
} from 'lucide-react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Sidebar() {
	// userEmail = 'user@example.com',
	// userName = 'John Doe'
	const navigate = useNavigate()
	const location = useLocation()
	const [expandedItems, setExpandedItems] = useState(['/delays/'])
	const [collapsed, setCollapsed] = useState(false) // 🔥 sidebar collapse state
	const { data, isLoading: Endloading } = useGetTimeQuery()
	console.log(Endloading)

	console.log(data)
	const menuItems = [
		{
			key: '/',
			icon: <Map size={20} />,
			label: (
				<div className='flex justify-between items-center w-full'>
					<span>Dashboard</span>
					<Badge
						variant='secondary'
						className='bg-indigo-700 text-white hover:bg-black hover:text-white ml-2'
					>
						70
					</Badge>
				</div>
			),
		},
		{
			key: '/map/',
			icon: <Map size={20} />,
			label: 'Xarita',
		},
		{
			key: '/archive/',
			icon: <Archive size={20} />,
			label: 'Arxiv',
		},
		{
			key: '/umumiy-qidiruv/',
			icon: <Search size={20} />,
			label: 'Umumiy Reklama',
		},
		{
			key: '/delays/',
			icon: <Clock size={20} />,
			label: (
				<div className='flex justify-between items-center w-full'>
					<span>Shartnomalar vaqti</span>
					<Badge
						variant='secondary'
						className='bg-green-600 text-white hover:bg-green-900 ml-2'
					>
						70
					</Badge>
				</div>
			),
			children: [
				{
					key: '/delay7/',
					label: (
						<div className='flex justify-between items-center w-full'>
							<span>7 Kun qolganlari</span>
							<Badge
								variant='secondary'
								className='bg-orange-500 text-white hover:bg-orange-600 ml-2'
							>
								30
							</Badge>
						</div>
					),
				},
				{
					key: '/delaysEnd/',
					label: (
						<div className='flex justify-between items-center w-full'>
							<span>Tugaganlari</span>
							<Badge
								variant='secondary'
								className='bg-red-500 text-white hover:bg-red-600 ml-2'
							>
								40
							</Badge>
						</div>
					),
				},
			],
		},
	]

	const toggleExpanded = key => {
		setExpandedItems(prev =>
			prev.includes(key) ? prev.filter(item => item !== key) : [...prev, key]
		)
	}

	const handleNavigation = key => {
		navigate(key)
	}

	const handleLogout = () => {
		console.log('Logout clicked')
		// logout logikasi shu yerda
	}

	const renderMenuItem = (item, level = 0) => {
		const isActive = location.pathname === item.key
		const isExpanded = expandedItems.includes(item.key)
		const hasChildren = item.children && item.children.length > 0

		return (
			<div key={item.key} className='w-full'>
				<button
					onClick={() => {
						if (hasChildren) {
							toggleExpanded(item.key)
						} else {
							handleNavigation(item.key)
						}
					}}
					className={`
            w-full flex items-center justify-between px-4 py-3 text-left transition-all duration-200 rounded-lg mx-2 mb-1
            ${level > 0 ? 'ml-6 pl-8' : ''}
            ${
							isActive
								? 'bg-gradient-to-r bg-white text-black shadow-lg '
								: 'text-white  hover:bg-blue-600 hover:text-white'
						}
          `}
				>
					<div className='flex items-center space-x-3'>
						{item.icon && (
							<span className={isActive ? 'text-black' : 'text-white'}>
								{item.icon}
							</span>
						)}
						{!collapsed && <span className='font-medium'>{item.label}</span>}
					</div>
					{hasChildren && !collapsed && (
						<span className='text-gray-400'>
							{isExpanded ? (
								<ChevronDown size={16} />
							) : (
								<ChevronRight size={16} />
							)}
						</span>
					)}
				</button>

				{hasChildren && isExpanded && !collapsed && (
					<div className='ml-4'>
						{item.children?.map(child => renderMenuItem(child, level + 1))}
					</div>
				)}
			</div>
		)
	}

	return (
		<div
			className={`h-screen bg-[#1777FF] border-r border-gray-800 flex flex-col transition-all  duration-300 ${
				collapsed ? 'w-20' : 'w-85'
			}`}
		>
			{/* Header */}
			<div className='p-6 flex justify-between items-center'>
				{!collapsed && (
					<div className='flex items-center space-x-2'>
						<img src='/logos.png' alt='metro logo' className='w-10' />
						<h1 className='text-2xl font-bold text-white'>Marketing</h1>
					</div>
				)}
				<button
					onClick={() => setCollapsed(!collapsed)}
					className='text-white p-2 rounded-full hover:bg-black transition'
				>
					{collapsed ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
				</button>
			</div>

			{/* Navigation */}
			<nav className='flex-1 py-6 overflow-y-auto'>
				<div className='space-y-1'>
					{menuItems.map(item => renderMenuItem(item))}
				</div>
			</nav>

			{/* Account Section */}
			{!collapsed && (
				<div className='p-4'>
					<div className='flex items-center space-x-3 mb-4 p-3 rounded-lg bg-white'>
						<div className='w-10 h-10 bg-gradient-to-r bg-black rounded-full flex items-center justify-center'>
							<User size={20} className='text-white' />
						</div>
						{/* <div className='flex-1 min-w-0'>
							<p className='text-sm font-medium text-black truncate'>
								{userName}
							</p>
							<p className='text-xs text-gray-400 truncate'>{userEmail}</p>
						</div> */}
					</div>

					{/* Logout */}
					<Button
						onClick={handleLogout}
						variant='ghost'
						className='w-full justify-start bg-red-600 text-gray-300 hover:text-white hover:bg-red-800 transition-colors'
					>
						<LogOut size={20} className='mr-3' />
						Logout
					</Button>
				</div>
			)}
		</div>
	)
}
