import {
	json,
	type ActionFunctionArgs,
	unstable_composeUploadHandlers as composeUploadHandlers,
	unstable_createMemoryUploadHandler as createMemoryUploadHandler,
	unstable_parseMultipartFormData as parseMultipartFormData,
	redirect,
} from '@remix-run/node'
import { Form, Link, useActionData, useNavigation } from '@remix-run/react'
import { MutableRefObject, useEffect, useRef } from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { useToast } from '~/components/ui/use-toast'
import { prisma } from '~/db.server'
import { requireUserId } from '~/utils/auth.server'
import { uploadImageToCloudinary } from '~/utils/utils.server'

export async function action({ request }: ActionFunctionArgs) {
	const userId = await requireUserId(request)
	if (!userId) {
		throw redirect('/login')
	}
	const formData = await request.formData()

	const title = formData.get('title')
	const imdbLink = formData.get('imdbLink')
	const plot = formData.get('plot')

	// TODO: Check duplicate via imdbLink

	await prisma.movie.create({
		data: {
			title: title as string,
			imdbLink: imdbLink as string,
			plot: plot as string,
		},
	})

	return json({
		status: 303,
		headers: {
			location: '/movies',
		},
	})
}

export default function AddMovie() {
	const { toast } = useToast()
	const data = useActionData<typeof action>()
	const navigation = useNavigation()

	const isAdding = navigation.state === 'submitting'

	const formRef: MutableRefObject<HTMLFormElement | null> = useRef(null)
	const titleInputRef: MutableRefObject<HTMLInputElement | null> = useRef(null)

	useEffect(() => {
		if (!isAdding) {
			formRef.current?.reset()
			titleInputRef.current?.focus()
		}
	}, [isAdding])

	return (
		<div className="max-w-2xl mx-auto">
			<Form ref={formRef} method="post" className="space-y-6">
				<div className="grid grid-cols-3">
					<Label htmlFor="title" variant="secondary">
						Title*
					</Label>
					<Input
						ref={titleInputRef}
						type="text"
						id="title"
						placeholder="Movie title..."
						name="title"
						className="rounded-l-none col-span-2"
					/>
				</div>
				<div className="grid grid-cols-3">
					<Label htmlFor="imdbLink" variant="secondary">
						IMDb Link
					</Label>
					<Input
						type="url"
						id="imdbLink"
						name="imdbLink"
						placeholder="https://www.imdb.com/title/tt0068646/"
						className="rounded-l-none col-span-2"
					/>
				</div>

				<div className="grid grid-cols-3">
					<Label htmlFor="plot" variant="secondary">
						Plot:
					</Label>
					<Input
						type="text"
						id="plot"
						name="plot"
						placeholder="A description of the movie..."
						className="rounded-l-none col-span-2"
					/>
				</div>

				<div className="flex items-center justify-between">
					<Link to="/movies">Go Back</Link>

					<Button
						onClick={e => {
							if (data) {
								toast({
									title: 'Movie added Successfully',
								})
							}
						}}
						type="submit"
					>
						{isAdding ? 'Saving...' : 'Add Movie'}
					</Button>
				</div>
			</Form>
		</div>
	)
}
