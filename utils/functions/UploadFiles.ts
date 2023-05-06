// @ts-nocheck
import type { NextApiRequest } from 'next'
import { IncomingForm } from 'formidable-serverless'
import Client from 'ssh2-sftp-client'
import bytes from 'bytes'

const UploadFiles: ReturnType = async (req: NextApiRequest) => {
	return new Promise(async (resolve) => {
		const uploadedFiles: IFile[] = []

		const form = new IncomingForm({
			maxFileSize: bytes(process.env.NEXT_PUBLIC_MAXSIZE || '5MB'),
			keepExtensions: true,
			multiples: true,
			// uploadDir: './public/uploads',
		})

		await form.parse(req, async (a, b, file) => {
			if (!file || !Object.entries(file) || file.length < 1 || Object.entries(file).length < 1)
				return resolve({ success: false, error: 'No files uploaded.' })

			const [_, files] = Object.entries(file)[0]

			if (Object.entries(files).length < 1) return resolve({ success: false, error: 'Not enough files.' })
			if (Object.entries(files).length > 10) return resolve({ success: false, error: 'Too much files.' })

			const sftp = new Client()

			console.log(typeof files, files.length)

			try {
				await sftp.connect({
					host: process.env.SFTP_HOST,
					port: process.env.SFTP_PORT,
					username: process.env.SFTP_USER,
					password: process.env.SFTP_PASSWORD,
				})

				if (files.length > 1) {
					for await (const file of Object.values(files)) {
						const fileName = file.path.split('\\')[file.path.split('\\').length - 1]
						const remoteFilePath = `${process.env.SFTP_PATH}/${fileName}`

						await sftp.put(file.path, remoteFilePath)

						uploadedFiles.push({
							name: file.name,
							path: fileName,
						})
					}
				} else {
					const fileName = files.path.split('\\')[files.path.split('\\').length - 1]
					const remoteFilePath = `${process.env.SFTP_PATH}/${fileName}`

					await sftp.put(files.path, remoteFilePath)

					uploadedFiles.push({
						name: files.name,
						path: fileName,
					})
				}

				await sftp.end()

				return resolve({
					success: uploadedFiles.length > 0 ? true : false,
					files: uploadedFiles.length > 0 ? uploadedFiles : undefined,
					error: uploadedFiles.length > 0 ? undefined : 'No files uploaded.',
				})
			} catch (err) {
				console.log(err)
				return resolve({ success: false, error: err.message })
			}
		})

		form.onPart = (part) => {
			if (part.mime === 'image/png' || part.mime === 'image/jpeg' || part.mime === 'image/gif')
				form.handlePart(part)
			else return resolve({ success: false, error: 'Only images are allowed!' })
		}

		form.on('error', (err) => resolve({ success: false, error: err }))
	})
}

type ReturnType = (req: NextApiRequest) => Promise<{ success: boolean; error?: string; files?: IFile[] }>

interface IFile {
	name: string
	path: string
}

export default UploadFiles
