'use client'

import Dropzone, { IFile } from './Dropzone'
import { useState } from 'react'
import UploadedFile from './UploadedFile'
import { BsInfoCircle } from 'react-icons/bs'
import { ActionIcon, Tooltip } from '@mantine/core'
import bytes from 'bytes'

const MainContainer = () => {
	const [uploadedFiles, setUploadedFiles] = useState<IFile[]>([])

	return (
		<>
			<div className='flex flex-col bg-white shadow-lg shadow-slate-800/10 rounded-lg p-4 w-full'>
				<div className='flex flex-row justify-between items-center mb-4'>
					<span className='font-semibold text-lg'>העלאת תמונות</span>
					<Tooltip label={<div>{process.env.NEXT_PUBLIC_MAXSIZE || '5MB'}</div>}>
						<ActionIcon>
							<BsInfoCircle />
						</ActionIcon>
					</Tooltip>
				</div>
				<Dropzone setUploadedFiles={setUploadedFiles} />
				{uploadedFiles.length > 0 && (
					<>
						<div className='bg-gray-200 rounded-lg h-0.5 w-full my-4' />
						<span className='font-medium mb-2 text-sm'>תמונות שהועלו</span>
						<div className='flex flex-col gap-2'>
							{uploadedFiles.map((file) => (
								<UploadedFile
									key={file.name}
									name={file.name}
									path={file.path}
								/>
							))}
						</div>
					</>
				)}
			</div>
		</>
	)
}

export default MainContainer
