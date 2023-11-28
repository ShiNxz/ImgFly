const Footer = () => {
	return (
		<div className='flex flex-row items-center justify-between bg-slate-600 text-white backdrop-blur-lg p-2 w-full'>
			<span>{process.env.WEBSITE_NAME || 'העלאת תמונות לענן'}</span>
			<span>{process.env.WEBSITE_NAME || 'העלאת תמונות לענן'}</span>
		</div>
	)
}

export default Footer
