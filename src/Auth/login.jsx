import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Lock, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const particlesRef = useRef(null)
	const navigate = useNavigate()

	useEffect(() => {
		const script = document.createElement('script')
		script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js'
		script.onload = () => {
			if (window.particlesJS && particlesRef.current) {
				window.particlesJS('particles-js', {
					particles: {
						number: { value: 80, density: { enable: true, value_area: 800 } },
						color: { value: '#6366f1' },
						shape: { type: 'circle', stroke: { width: 0, color: '#000000' } },
						opacity: {
							value: 0.3,
							random: false,
							anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false },
						},
						size: {
							value: 3,
							random: true,
							anim: { enable: false, speed: 40, size_min: 0.1, sync: false },
						},
						line_linked: {
							enable: true,
							distance: 150,
							color: '#8b5cf6',
							opacity: 0.2,
							width: 1,
						},
						move: {
							enable: true,
							speed: 2,
							direction: 'none',
							random: false,
							straight: false,
							out_mode: 'out',
							bounce: false,
						},
					},
					interactivity: {
						detect_on: 'canvas',
						events: {
							onhover: { enable: true, mode: 'repulse' },
							onclick: { enable: true, mode: 'push' },
							resize: true,
						},
						modes: {
							grab: { distance: 400, line_linked: { opacity: 1 } },
							bubble: {
								distance: 400,
								size: 40,
								duration: 2,
								opacity: 8,
								speed: 3,
							},
							repulse: { distance: 200, duration: 0.4 },
							push: { particles_nb: 4 },
							remove: { particles_nb: 2 },
						},
					},
					retina_detect: true,
				})
			}
		}
		document.head.appendChild(script)

		return () => {
			document.head.removeChild(script)
		}
	}, [])

	const handleSubmit = async e => {
		e.preventDefault()
		setIsLoading(true)

		try {
			const response = await fetch('http://192.168.10.41:9000/api/token/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					username,
					password,
				}),
			})

			if (response.ok) {
				const data = await response.json()
				localStorage.setItem('token_marketing', data.access)
				navigate('/')
			} else {
				console.error('Login failed')
				// Handle login error here
			}
		} catch (error) {
			console.error('Network error:', error)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden'>
			<div
				id='particles-js'
				ref={particlesRef}
				className='absolute inset-0 z-0'
			/>

			<Card className='w-full max-w-md relative z-10 backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl animate-fade-in-up'>
				<CardHeader className='space-y-1 text-center pb-8'>
					<div className='mx-auto w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 animate-scale-in backdrop-blur-sm'>
						<img src='/logos.png' alt='' width={50} />
					</div>
					<CardTitle className='text-2xl font-semibold text-white'>
						Marketing ERP
					</CardTitle>
					<CardDescription className='text-white/70'>
						Foydalanuvchi nomi va parolingizni kiriting
					</CardDescription>
				</CardHeader>

				<CardContent>
					<form onSubmit={handleSubmit} className='space-y-6'>
						<div className='space-y-2'>
							<Label
								htmlFor='username'
								className='text-sm font-medium text-white'
							>
								Foydalanuvchi nomi
							</Label>
							<div className='relative group'>
								<User className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60 group-focus-within:text-white transition-colors' />
								<Input
									id='username'
									type='text'
									placeholder='Foydalanuvchi nomi'
									value={username}
									onChange={e => setUsername(e.target.value)}
									className='pl-10 h-12 bg-white/10 border-white/20 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-200 rounded-xl text-white placeholder:text-white/50 backdrop-blur-sm hover:bg-white/15'
									required
								/>
							</div>
						</div>

						<div className='space-y-2'>
							<Label
								htmlFor='password'
								className='text-sm font-medium text-white'
							>
								Parol
							</Label>
							<div className='relative group'>
								<Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60 group-focus-within:text-white transition-colors' />
								<Input
									id='password'
									type={showPassword ? 'text' : 'password'}
									placeholder='Parol'
									value={password}
									onChange={e => setPassword(e.target.value)}
									className='pl-10 pr-10 h-12 bg-white/10 border-white/20 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-200 rounded-xl text-white placeholder:text-white/50 backdrop-blur-sm hover:bg-white/15'
									required
								/>
								<button
									type='button'
									onClick={() => setShowPassword(!showPassword)}
									className='absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors'
								>
									{showPassword ? (
										<EyeOff className='w-4 h-4' />
									) : (
										<Eye className='w-4 h-4' />
									)}
								</button>
							</div>
						</div>

						<Button
							type='submit'
							className='w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl backdrop-blur-sm'
							disabled={isLoading}
						>
							{isLoading ? (
								<div className='flex items-center space-x-2'>
									<div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
									<span>Dasturga kirmoqda...</span>
								</div>
							) : (
								'Dasturga kirish'
							)}
						</Button>
					</form>
				</CardContent>
			</Card>

			<style jsx>{`
				@keyframes fade-in-up {
					from {
						opacity: 0;
						transform: translateY(20px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				@keyframes scale-in {
					from {
						opacity: 0;
						transform: scale(0.8);
					}
					to {
						opacity: 1;
						transform: scale(1);
					}
				}

				.animate-fade-in-up {
					animation: fade-in-up 0.6s ease-out;
				}

				.animate-scale-in {
					animation: scale-in 0.5s ease-out 0.2s both;
				}
			`}</style>
		</div>
	)
}
