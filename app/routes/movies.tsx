import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node'
import {
	Form,
	Link,
	Outlet,
	useActionData,
	useFetcher,
	useLoaderData,
	useSearchParams,
	useSubmit,
} from '@remix-run/react'
import { format } from 'date-fns'
import { CalendarIcon, PlusSquareIcon, Telescope } from 'lucide-react'
import { memo, useState } from 'react'
import invariant from 'tiny-invariant'
import { PageTitle } from '~/components/Helpers'
import { Button } from '~/components/ui/button'
import { Calendar } from '~/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogTrigger,
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '~/components/ui/popover'
import { useToast } from '~/components/ui/use-toast'
import { prisma } from '~/db.server'
import { cn } from '~/lib/utils'
import { authenticator, requireUserId } from '~/utils/auth.server'

export async function loader({ request }: LoaderFunctionArgs) {
	const userId = await authenticator.isAuthenticated(request)
	const url = new URL(request.url)
	const search = url.searchParams.get('s')

	const movies = await prisma.movie.findMany({
		where: {
			title: {
				contains: search ?? '',
			},
			watchedBy: {
				none: {
					userId: userId ?? undefined,
				},
			},
		},
		select: {
			id: true,
			title: true,
			releaseDate: true,
			plot: true,
			poster: true,
			watchedBy: {
				select: {
					note: true,
				},
			},
			_count: {
				select: {
					watchedBy: true,
					watchNextBy: true,
				},
			},
		},
	})
	return { movies, isAuthenticated: !!userId }
}

export async function action({ request }: ActionFunctionArgs) {
	console.log('calling action')
	const userId = await requireUserId(request)
	const formData = await request.formData()

	const { intent, content } = Object.fromEntries(formData)
	const movieId = formData.get('movieId')
	const watchedAt = formData.get('watchedAt')
	console.log({ watchedAt })

	if (!movieId) {
		return json({ success: false, message: 'movieId is required' }, 400)
	}
	invariant(typeof movieId === 'string', 'movieId must be a string')

	switch (intent) {
		case 'watched-at':
			if (!watchedAt) {
				return json({ success: false, message: 'watchedAt is required' }, 400)
			}

			if (typeof watchedAt !== 'string') {
				return json(
					{ success: false, message: 'watchedAt date format is not correct' },
					400,
				)
			}

			const isoFormattedDate = new Date(watchedAt.toString()).toISOString()
			console.log({ isoFormattedDate })
			await prisma.user.update({
				where: {
					id: userId,
				},
				data: {
					watchedMovies: {
						create: {
							movieId: movieId,
							watchedAt: isoFormattedDate,
						},
					},
				},
			})
			break
		case 'watch-next':
			await prisma.user.update({
				where: {
					id: userId,
				},
				data: {
					watchNextMovies: {
						connect: {
							id: movieId,
						},
					},
				},
			})
			break
	}

	return json({ success: true })
}

export default function Movies() {
	const { movies, isAuthenticated } = useLoaderData<typeof loader>()
	const [searchParams] = useSearchParams()
	const search = searchParams.get('s') ?? ''
	const submit = useSubmit()
	const watchNextFetcher = useFetcher()

	return (
		<main className="container space-y-20">
			<div className="flex items-end gap-8">
				<PageTitle>Movies</PageTitle>

				<Form
					method="get"
					className="flex items-center w-full"
					onChange={e => {
						submit(e.currentTarget)
					}}
				>
					<Input
						type="text"
						name="s"
						placeholder="Search for a movie..."
						className="rounded-r-none"
						defaultValue={search}
					/>
					<Button size="lg" type="submit" className="rounded-l-none">
						Search
					</Button>
				</Form>

				{isAuthenticated && (
					<Button asChild variant="outline" className="gap-4">
						<Link to="add">
							Add Movie <PlusSquareIcon className="w-4" />
						</Link>
					</Button>
				)}
			</div>

			<Outlet />

			<ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{movies.map(movie => (
					<li key={movie.id}>
						<Card>
							<CardHeader>
								<div className="flex gap-8 items-start">
									{/* <div className="w-20 h-20 bg-slate-400 rounded-md">
										{movie.poster ? (
											<img
												src={movie.poster}
												alt={movie.title}
												className="w-full h-full object-cover rounded-md"
											/>
										) : null}
									</div> */}
									<div className="space-y-4">
										<CardTitle className="capitalize">{movie.title}</CardTitle>
										<div className="flex text-xs text-right items-center gap-2">
											<Telescope className="w-3" /> {movie._count.watchedBy}
										</div>
									</div>
								</div>
							</CardHeader>
							<CardContent className="space-y-10">
								<p>{movie.plot?.slice(0, 30)}...</p>

								{isAuthenticated && (
									<div className="space-y-2 flex flex-col items-center">
										<MarkAsWatchedDialog movieId={movie.id} />
										<watchNextFetcher.Form method="post" className="w-full">
											<input type="hidden" name="movieId" value={movie.id} />
											<Button
												variant="outline"
												name="intent"
												value="watch-next"
												type="submit"
												className="w-full"
											>
												Add to watch next
											</Button>
										</watchNextFetcher.Form>
									</div>
								)}
							</CardContent>
						</Card>
					</li>
				))}
			</ul>
		</main>
	)
}

const MarkAsWatchedDialog = memo(({ movieId }: { movieId: string }) => {
	const { toast } = useToast()
	const data = useActionData<typeof action>()
	console.log('action data', data)
	const watchedAtFetcher = useFetcher<typeof action>()
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

	const date = selectedDate?.getDate() ?? 1
	const month = selectedDate?.getMonth() ?? 1
	const year = selectedDate?.getFullYear() ?? 2010

	const watchedDate = `${year}-${month < 10 ? `0${month}` : month}-${date < 10 ? `0${date}` : date}`
	return (
		<watchedAtFetcher.Form method="post" className="w-full">
			<div className="grid gap-4 py-4">
				<div className="grid grid-cols-4 items-center gap-4">
					<Label className="text-right">Watched at</Label>
					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								className={cn(
									'w-[280px] justify-start text-left font-normal',
									!selectedDate && 'text-muted-foreground',
								)}
							>
								<CalendarIcon className="mr-2 h-4 w-4" />
								{selectedDate ? (
									format(selectedDate, 'PPP')
								) : (
									<span>Pick a date</span>
								)}
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0">
							<Calendar
								mode="single"
								selected={selectedDate}
								required
								onSelect={(_, selectedDay, i, e) => {
									e.preventDefault()
									console.log('selected day')
									setSelectedDate(selectedDay)
								}}
								initialFocus
							/>
						</PopoverContent>
					</Popover>
				</div>
			</div>
			<input
				type="text"
				name="movieId"
				defaultValue={movieId}
				className="sr-only"
			/>
			<input
				type="date"
				name="watchedAt"
				defaultValue={watchedDate}
				className="sr-only"
			/>
			<Button
				name="intent"
				value="watched-at"
				type="submit"
				className="w-full"
				// onClick={e => {
				// 	e.preventDefault()
				// 	if (data) {
				// 		console.log('display toast now')
				// 		toast({
				// 			title: 'Movie Added To Your Diary',
				// 		})
				// 	}
				// }}
			>
				Mark as watched
			</Button>
		</watchedAtFetcher.Form>
	)
})
