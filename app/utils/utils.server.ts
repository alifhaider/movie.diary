// utils/util.server.js

import cloudinary, { type UploadApiResponse } from 'cloudinary'
import { writeAsyncIterableToWritable } from '@remix-run/node'

cloudinary.v2.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadImageToCloudinary(data: AsyncIterable<Uint8Array>) {
	const uploadPromise = new Promise<UploadApiResponse>(
		async (resolve, reject) => {
			const uploadStream = cloudinary.v2.uploader.upload_stream(
				{
					folder: 'movies',
				},
				(error, result) => {
					console.log('error in upload', error)
					if (error || !result) {
						reject(error)
						return
					}
					resolve(result)
				},
			)
			await writeAsyncIterableToWritable(data, uploadStream)
		},
	)

	return uploadPromise
}
