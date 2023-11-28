const Navbar = () => {
	return (
		<div className='flex flex-row items-center justify-between bg-white/50 backdrop-blur-lg p-4 w-full'>
			<span>{process.env.WEBSITE_NAME || 'העלאת תמונות לענן'}</span>
			<span>{process.env.WEBSITE_NAME || 'העלאת תמונות לענן'}</span>
		</div>
	)
}

export default Navbar
