import type { IFile } from './Dropzone'
import { Button, CopyButton, Input } from '@mantine/core'

const UploadedFile = ({ path }: IFile) => {
	return (
		<Input
			readOnly
			size='lg'
			defaultValue={`${process.env.NEXT_PUBLIC_DOMAIN}/uploads/${path}`}
			classNames={{ input: '!text-xs' }}
			rightSection={
				<CopyButton value={`${process.env.NEXT_PUBLIC_DOMAIN}/uploads/${path}`}>
					{({ copied, copy }) => (
						<Button
							color={copied ? 'teal' : 'blue'}
							onClick={copy}
							size='xs'
							w={110}
						>
							{copied ? 'הקישור הועתק!' : 'העתק קישור'}
						</Button>
					)}
				</CopyButton>
			}
			rightSectionWidth={130}
			onFocus={(event) => event.target.select()}
		/>
	)
}

export default UploadedFile
