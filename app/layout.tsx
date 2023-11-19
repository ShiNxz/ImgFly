// import Footer from './Components/Footer'
// import Navbar from './Components/Navbar'
import { Rubik } from 'next/font/google'
import { MantineProvider, DirectionProvider } from '@mantine/core'

import './globals.scss'
import '@kirklin/reset-css/kirklin.css'
import '@mantine/core/styles.css'

const rubik = Rubik({ subsets: ['hebrew'] })

export const metadata = {
	title: 'UploadTs',
	description: 'העלאת תמונות לענן',
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<html
			lang='he'
			dir='rtl'
		>
			<body className={rubik.className + '  bg-slate-200'}>
				<DirectionProvider initialDirection='rtl'>
					<MantineProvider>
						<div className='h-screen flex flex-col justify-center items-center'>
							<main className='container'>{children}</main>
						</div>
					</MantineProvider>
				</DirectionProvider>
			</body>
		</html>
	)
}

export default RootLayout
