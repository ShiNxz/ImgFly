// @ts-nocheck
import type { NextApiRequest } from 'next'
import { IncomingForm } from 'formidable-serverless'
import Client from 'ssh2-sftp-client'
import bytes from 'bytes'

const mimeTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp']

const UploadFiles: ReturnType = async (req: NextApiRequest) => {
	return new Promise(async (resolve, reject) => {
		const uploadedFiles: IFile[] = []

		const form = new IncomingForm({
			maxFileSize: bytes(process.env.NEXT_PUBLIC_MAXSIZE || '2MB'),
			keepExtensions: true,
			multiples: true,
		})

		console.log(process.env.NEXT_PUBLIC_DOMAIN)
		
		await form.parse(req, async (a, b, file) => {
			if (!file || !Object.entries(file) || file.length < 1 || Object.entries(file).length < 1)
				return reject('No files uploaded.')

			const [_, files] = Object.entries(file)[0]

			if (Object.entries(files).length < 1) return reject('Not enough files.')
			if (Object.entries(files).length > 10) return reject('Too much files.')

			const sftp = new Client()

			try {
				await sftp.connect({
					host: process.env.SFTP_HOST,
					port: process.env.SFTP_PORT,
					username: process.env.SFTP_USER,
					password: process.env.SFTP_PASSWORD,
				})

				if (files.length > 1) {
					for await (const file of Object.values(files)) {
						const fileName = file.path.split('\\')[file.path.split('\\').length - 1].replace('/tmp/', '')
						const remoteFilePath = `${process.env.SFTP_PATH}/${fileName}`

						await sftp.put(file.path, remoteFilePath)

						uploadedFiles.push({
							name: file.name,
							path: fileName,
							fullPath: `${process.env.NEXT_PUBLIC_DOMAIN}/${fileName}`,
						})
					}
				} else {
					const fileName = files.path.split('\\')[files.path.split('\\').length - 1].replace('/tmp/', '')
					const remoteFilePath = `${process.env.SFTP_PATH}/${fileName}`

					await sftp.put(files.path, remoteFilePath)

					uploadedFiles.push({
						name: files.name,
						path: fileName,
						fullPath: `${process.env.NEXT_PUBLIC_DOMAIN}/${fileName}`,
					})
				}

				await sftp.end()

				if (uploadedFiles.length < 1) return reject('No files uploaded.')

				return resolve({ files: uploadedFiles })
			} catch (err) {
				return reject(err.message)
			}
		})

		form.onPart = (part) => {
			if (mimeTypes.find((mime) => mime === part.mime)) form.handlePart(part)
			else return reject('Invalid file type.')
		}

		form.on('error', (err) => reject(err))
	})
}

type ReturnType = (req: NextApiRequest) => Promise<{ files: IFile[] } | string>

interface IFile {
	name: string
	path: string
	fullPath: string
}

export default UploadFiles
