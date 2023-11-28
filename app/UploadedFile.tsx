'use client'

import type { IFile } from './Dropzone'
import Image from 'next/image'
import { Button, CopyButton, Input, Progress } from '@mantine/core'

const UploadedFile = ({ path, progress }: IFile) => {
	return (
		<div className='flex flex-row gap-4 items-center justify-between'>
			{path && (
				<Image
					src={path}
					alt={path}
					className='rounded-md aspect-square object-cover w-10 h-10'
					width={40}
					height={40}
				/>
			)}
			{path ? (
				<Input
					size='md'
					defaultValue={path}
					classNames={{ input: '!text-xs' }}
					onFocus={(event) => event.target.select()}
					className='w-full'
					readOnly
				/>
			) : (
				<Progress
					value={progress}
					className='w-full'
					color='blue'
					striped
					animated
				/>
			)}
			<CopyButton value={path || ''}>
				{({ copied, copy }) => (
					<Button
						color={copied ? 'teal' : 'blue'}
						onClick={copy}
						disabled={!path}
						className='z-50'
						size='xs'
						w={110}
					>
						{copied ? 'הקישור הועתק!' : path ? 'העתק קישור' : 'אנא המתן'}
					</Button>
				)}
			</CopyButton>
		</div>
	)
}

export default UploadedFile
