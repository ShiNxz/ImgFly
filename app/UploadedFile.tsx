'use client'

import type { IFile } from './Dropzone'
import { Button, CopyButton, Input } from '@mantine/core'

const UploadedFile = ({ path }: IFile) => {
	return (
		<div className='flex flex-row gap-4 items-center'>
			<Input
				size='md'
				defaultValue={`${process.env.NEXT_PUBLIC_DOMAIN}/${path}`}
				classNames={{ input: '!text-xs' }}
				onFocus={(event) => event.target.select()}
				className='w-full'
				readOnly
			/>
			<CopyButton value={`${process.env.NEXT_PUBLIC_DOMAIN}/${path}`}>
				{({ copied, copy }) => (
					<Button
						color={copied ? 'teal' : 'blue'}
						onClick={copy}
						className='z-50'
						size='xs'
						w={110}
					>
						{copied ? 'הקישור הועתק!' : 'העתק קישור'}
					</Button>
				)}
			</CopyButton>
		</div>
	)
}

export default UploadedFile
