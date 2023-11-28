import { initEdgeStore } from '@edgestore/server'
import { createEdgeStoreNextHandler } from '@edgestore/server/adapters/next/pages'
import bytes from 'bytes'

const es = initEdgeStore.create()

/**
 * This is the main router for the edgestore buckets.
 */
const edgeStoreRouter = es.router({
	uploadedFiles: es.fileBucket({ maxSize: bytes(process.env.NEXT_PUBLIC_MAXSIZE || '5MB') }),
})

export default createEdgeStoreNextHandler({
	router: edgeStoreRouter,
})

/**
 * This type is used to create the type-safe client for the frontend.
 */
export type EdgeStoreRouter = typeof edgeStoreRouter
