import type { NextApiRequest, NextApiResponse } from 'next'
import UploadFiles from '@/utils/functions/UploadFiles'

export const config = {
	api: {
		externalResolver: true,
		bodyParser: false,
	},
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { method } = req

	switch (method) {
		case 'POST': {
			try {
				const upload = await UploadFiles(req)
				res.status(200).json(upload)
			} catch (err) {
				console.log(err)
				res.status(400).json({ error: err })
			}
		}

		default:
			return res.status(401).end()
	}
}

export default handler
