import { Button, Card, Divider, Image, Space, Spin, Typography } from 'antd'
import moment from 'moment'
import { useParams } from 'react-router-dom'
import { useGetShowArchiveQuery } from '../services/api'

export default function ShowArchive() {
	const { ida } = useParams()
	const { data, isLoading, isError } = useGetShowArchiveQuery(ida)

	if (isLoading) {
		return (
			<div className='w-full h-screen flex justify-center items-center'>
				<Spin />
			</div>
		)
	}

	if (isError) {
		return <p>Xatolik yuz berdi</p>
	}

	if (!data) {
		return <p>Ma'lumot topilmadi</p>
	}

	return (
		<div className='min-h-screen bg-transparent p-6'>
			<div>
				{/* Header Card with Action Buttons */}
				<Card
					className='mb-6  border-0 rounded-2xl overflow-hidden'
					bodyStyle={{ padding: 0 }}
				>
					<div className='bg-gradient-to-r from-blue-600 to-indigo-600 p-8'>
						<div className='flex justify-between items-center'>
							<div className='flex gap-6 items-center'>
								<div className='relative'>
									<Image
										src={data.photo || '/placeholder.svg'}
										width={120}
										height={120}
										alt='reklama rasmi'
										className='rounded-xl border-4 border-white/20 shadow-lg'
										fallback='/impactful-advertisement.png'
									/>
								</div>
								<div className='text-white flex items-start flex-col h-full '>
									<h1 className='text-[40px]/[40px] font-bold'>
										{data.Reklama_nomi}
									</h1>
									{/* <div className='flex gap-3 mb-3'>
											<Tag color='blue' className='px-3 py-1'>
												{reklama.Qurilma_turi}
											</Tag>
											<Tag color='green' className='px-3 py-1'>
												{reklama.O_lchov_birligi}
											</Tag>
										</div> */}
									<p className='text-blue-100 text-3xl'>
										Ijarachi:{' '}
										<span className='font-semibold'>{data.Ijarachi}</span>
									</p>
								</div>
							</div>
						</div>
					</div>
				</Card>

				{/* Details Cards */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-15'>
					{/* Contract Information */}
					<Card
						title="Shartnoma ma'lumotlari"
						className='shadow-md rounded-xl border-0 '
						headStyle={{
							backgroundColor: '#f8fafc',
							borderRadius: '12px 12px 0 0',
						}}
					>
						<Space direction='vertical' className='w-full' size='middle'>
							<div>
								<Typography.Text type='secondary'>
									Shartnoma raqami:
								</Typography.Text>
								<Typography.Text strong className='block text-lg'>
									{data.Shartnoma_raqami}
								</Typography.Text>
							</div>
							<div>
								<Typography.Text type='secondary'>
									Qurilma turi:
								</Typography.Text>
								<Typography.Text strong className='block text-lg'>
									{data.Qurilma_turi}
								</Typography.Text>
							</div>
							<div>
								<Typography.Text type='secondary'>
									O'lchov birligi:
								</Typography.Text>
								<Typography.Text strong className='block text-lg'>
									{data.O_lchov_birligi}
								</Typography.Text>
							</div>
							<Divider className='my-2' />
							<div>
								<Typography.Text type='secondary'>
									Boshlanish sanasi:
								</Typography.Text>
								<Typography.Text strong className='block'>
									{moment(data.Shartnoma_muddati_boshlanishi).format(
										'DD.MM.YYYY'
									)}
								</Typography.Text>
							</div>
							<div>
								<Typography.Text type='secondary'>
									Tugash sanasi:
								</Typography.Text>
								<Typography.Text strong className='block'>
									{moment(data.Shartnoma_tugashi).format('DD.MM.YYYY')}
								</Typography.Text>
							</div>
						</Space>
					</Card>

					{/* Financial Information */}
					<Card
						title="Moliyaviy ma'lumotlar"
						className='shadow-md rounded-xl border-0'
						headStyle={{
							backgroundColor: '#f8fafc',
							borderRadius: '12px 12px 0 0',
						}}
					>
						<Space direction='vertical' className='w-full' size='middle'>
							<div>
								<Typography.Text type='secondary'>
									Qurilma narxi:
								</Typography.Text>
								<Typography.Text
									strong
									className='block text-lg text-green-600'
								>
									{data.Qurilma_narxi?.toLocaleString()} so'm
								</Typography.Text>
							</div>
							<Divider className='my-2' />
							<div>
								<Typography.Text type='secondary'>
									Shartnoma summasi:
								</Typography.Text>
								<Typography.Text strong className='block text-lg text-blue-600'>
									{data.Shartnoma_summasi?.toLocaleString()} so'm
								</Typography.Text>
							</div>
							<div>
								<Typography.Text type='secondary'>
									Egallagan maydon:
								</Typography.Text>
								<Typography.Text strong className='block'>
									{data.Egallagan_maydon}
								</Typography.Text>
							</div>
						</Space>
					</Card>

					{/* Contact Information */}
					<Card
						title="Aloqa ma'lumotlari"
						className='shadow-md rounded-xl border-0'
						headStyle={{
							backgroundColor: '#f8fafc',
							borderRadius: '12px 12px 0 0',
						}}
					>
						<Space direction='vertical' className='w-full' size='middle'>
							<div>
								<Typography.Text type='secondary'>
									Telefon raqami:
								</Typography.Text>
								<Typography.Text strong className='block text-lg'>
									{data.contact_number}
								</Typography.Text>
							</div>
							<Divider className='my-2' />
							{data.Shartnoma_fayl && (
								<div>
									<Typography.Text type='secondary'>
										Shartnoma fayli:
									</Typography.Text>
									<Button
										type='link'
										href={data.Shartnoma_fayl}
										target='_blank'
										className='p-0 h-auto'
									>
										Faylni yuklab olish
									</Button>
								</div>
							)}
							{data.Shartnoma_fayl && (
								<div>
									<Typography.Text type='secondary'>
										Reklama rasmini yuklash:
									</Typography.Text>
									<Button
										type='link'
										href={data.photo}
										target='_blank'
										className='p-0 h-auto'
									>
										Faylni yuklab olish
									</Button>
								</div>
							)}
						</Space>
					</Card>
				</div>
			</div>
		</div>
	)
}
