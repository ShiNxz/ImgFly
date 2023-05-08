// import Footer from './Components/Footer'
// import Navbar from './Components/Navbar'
import { Rubik } from 'next/font/google'
import './globals.scss'
import '@kirklin/reset-css/kirklin.css'

const rubik = Rubik({ subsets: ['hebrew'] })

export const metadata = {
	title: 'UploadTs',
	description: 'העלאת תמונות לענן',
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<html lang='he'>
			<body className={rubik.className + '  bg-slate-200'}>
				<div className='h-screen flex flex-col justify-center items-center'>
					{/* <Navbar /> */}
					<main className='container'>{children}</main>
					{/* <Footer /> */}
				</div>
			</body>
		</html>
	)
}

export default RootLayout
