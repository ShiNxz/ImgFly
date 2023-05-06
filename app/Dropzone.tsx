'use client'

import { useDropzone } from 'react-dropzone'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { Loader } from '@mantine/core'
import { useState } from 'react'
import axios from 'axios'
import bytes from 'bytes'

const Dropzone = ({ setUploadedFiles }: { setUploadedFiles: React.Dispatch<React.SetStateAction<IFile[]>> }) => {
	const [isUploading, setIsUploading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } = useDropzone({
		accept: { 'image/*': [] },
		maxFiles: 10,
		maxSize: bytes(process.env.NEXT_PUBLIC_MAXSIZE || '5MB'),
		disabled: isUploading,
		async onDrop(acceptedFiles) {
			if (acceptedFiles.length === 0) return setError('לא נבחרו קבצים')

			setIsUploading(true)

			let formData = new FormData()
			acceptedFiles.forEach((file) => formData.append('file', file))

			const { data, status } = await axios.post('/api/upload', formData)
			if (data.error || !data.files || status !== 200) {
				setError(data.error || 'שגיאה בעת העלאת הקבצים')
				return setIsUploading(false)
			}

			const { files } = data as { files: IFile[] }

			setUploadedFiles((prev) => [...prev, ...files])
			setIsUploading(false)
		},
	})

	return (
		<div
			className={`p-10 px-28 rounded-lg border-2 flex flex-col items-center duration-200 ${
				isDragReject || error ? 'border-red-500 !bg-red-500/20' : ''
			} ${
				isDragAccept
					? 'text-blue-600 border-blue-500 !bg-blue-500/10'
					: 'border-dashed border-gray-400 bg-gray-400/10'
			} text-center cursor-pointer`}
			{...getRootProps({ isFocused, isDragAccept, isDragReject })}
		>
			<input {...getInputProps()} />
			{error ? (
				<>{error}</>
			) : isUploading ? (
				<>
					<Loader
						size={30}
						className='mb-2'
					/>
					<p className='text-base font-medium'>מעלה קבצים...</p>
					<p className='text-sm'>אנא המתן</p>
				</>
			) : (
				<>
					<AiOutlineCloudUpload
						size='35'
						className='mb-2'
					/>
					<p className='text-base font-medium'>לחצו ובחרו תמונות להעלאה</p>
					<p className='text-sm'>או גררו אותם לפה</p>
				</>
			)}
		</div>
	)
}

export interface IFile {
	name: string
	path: string
}

export default Dropzone
