import { ActionFunctionArgs } from '@remix-run/node'
import { Form, Link, useActionData } from '@remix-run/react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { useToast } from '~/components/ui/use-toast'
import { prisma } from '~/db.server'

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData()
	const title = formData.get('title')
	const imdbLink = formData.get('imdbLink')
	const plot = formData.get('plot')
	const poster = formData.get('poster')

	// TODO: Check duplicate via imdbLink

	await prisma.movie.create({
		data: {
			title: title as string,
			imdbLink: imdbLink as string,
			plot: plot as string,
			poster: poster as string,
		},
	})

	return {
		status: 303,
		headers: {
			location: '/movies',
		},
	}
}

export default function AddMovie() {
	const { toast } = useToast()
	const data = useActionData<typeof action>()

	if (data) {
		toast({
			title: 'Movie added Successfully',
		})
	}

	return (
		<div className="max-w-2xl mx-auto">
			<Form method="post" className="space-y-6">
				<div className="grid grid-cols-3">
					<Label htmlFor="title" variant="secondary">
						Title*
					</Label>
					<Input
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

				<div className="grid grid-cols-3">
					<Label htmlFor="poster" variant="secondary">
						Poster:
					</Label>
					<Input
						type="file"
						id="picture"
						name="poster"
						className="rounded-l-none col-span-2"
					/>
				</div>
				<div className="flex items-center justify-between">
					<Link to="/movies">Go Back</Link>

					<Button type="submit">Add Movie</Button>
				</div>
			</Form>
		</div>
	)
}
