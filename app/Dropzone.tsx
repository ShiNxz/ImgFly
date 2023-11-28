'use client'

import { useDropzone } from 'react-dropzone'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { useEdgeStore } from '@/utils/edgestore'
import { Loader } from '@mantine/core'
import { useState } from 'react'
import bytes from 'bytes'

const Dropzone = ({ uploadedFiles, setUploadedFiles }: Props) => {
	const [isUploading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const { edgestore } = useEdgeStore()

	const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } = useDropzone({
		accept: { 'image/*': [] },
		maxFiles: 10,
		maxSize: bytes(process.env.NEXT_PUBLIC_MAXSIZE || '5MB'),
		disabled: isUploading,
		async onDrop(acceptedFiles) {
			if (acceptedFiles.length === 0) return setError('לא נבחרו קבצים')

			const newFiles = [
				...acceptedFiles.filter((files) => {
					// Check for duplicates
					const duplicate = uploadedFiles.find((f) => f.name === files.name)
					return duplicate ? false : true
				}),
			].map((file) => ({
				name: file.name,
				path: null,
				progress: 10,
			}))

			setUploadedFiles((prev) => [...prev, ...newFiles])

			await Promise.all(
				acceptedFiles.map(async (file) => {
					try {
						const res = await edgestore.uploadedFiles.upload({
							file,
							onProgressChange: async (progress) => {
								setUploadedFiles((prev) => {
									const fileIndex = prev.findIndex((f) => f.name === file.name)
									if (fileIndex === -1) return prev

									const newFiles = [...prev]
									newFiles[fileIndex].progress = progress
									return newFiles
								})
							},
						})

						setUploadedFiles((prev) => {
							const fileIndex = prev.findIndex((f) => f.name === file.name)
							if (fileIndex === -1) return prev

							const newFiles = [...prev]
							newFiles[fileIndex].path = res.url
							return newFiles
						})
					} catch (err) {
						setUploadedFiles((prev) => prev.filter((f) => f.name !== file.name))
					}
				})
			)
		},
	})

	return (
		<div
			className={`p-10 px-28 h-44 justify-center rounded-lg border-2 flex flex-col items-center duration-200 ${
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

interface Props {
	uploadedFiles: IFile[]
	setUploadedFiles: React.Dispatch<React.SetStateAction<IFile[]>>
}

export interface IFile {
	name: string
	path: string | null
	progress: number
}

export default Dropzone
