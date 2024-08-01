import { LoaderFunctionArgs, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { PageTitle } from '~/components/Helpers'
import { prisma } from '~/db.server'
import { requireUserId } from '~/utils/auth.server'

export async function loader({ request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	if (!userId) {
		throw redirect('/login')
	}
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: {
			username: true,
			email: true,
			image: true,
			watchedMovies: {
				select: {
					watchedAt: true,
					movie: {
						select: {
							id: true,
							title: true,
							releaseDate: true,
						},
					},
				},
			},
			watchNextMovies: {
				select: {
					movie: {
						select: {
							id: true,
							title: true,
							releaseDate: true,
						},
					},
				},
			},
			_count: {
				select: {
					watchedMovies: true,
					watchNextMovies: true,
				},
			},
		},
	})
	return user
}

export default function Profile() {
	const user = useLoaderData<typeof loader>()
	const today = new Date()

	function getFormattedDate(date: string) {
		const watchedAt = new Date(date)
		const diffTime = Math.abs(today.getTime() - watchedAt.getTime())
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

		if (diffDays === 0) return 'Today'
		if (diffDays === 1) return 'Yesterday'
		if (diffDays < 7) return `${diffDays} days ago`
		if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
		if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
		if (diffDays >= 365) return `${Math.floor(diffDays / 365)} years ago`

		return `${diffDays} days ago`
	}

	return (
		<main className="container flex flex-col space-y-10">
			<div className="flex items-end ">
				<div className="w-16 h-16 rounded-md bg-slate-400 mt-10"></div>

				<PageTitle>
					<span className="flex items-end">
						<span className="underline">@{user?.username}</span>

						<span className="text-base text-gray-500">
							&lt;{user?.email}&gt;
						</span>
					</span>
				</PageTitle>
			</div>
			<div className="flex items-center gap-4 space-y-8">
				<div>
					<h2>Watched Movies</h2>
					<p>{user?._count.watchedMovies}</p>
					<ul>
						{user?.watchedMovies.map(movie => (
							<li key={movie.movie.id} className="flex items-end">
								<h3 className="text-2xl capitalize">{movie.movie.title}</h3>
								<span className="text-gray-500 text-sm">
									{getFormattedDate(movie.watchedAt)}
								</span>
							</li>
						))}
					</ul>

					<h2>Watch Next Movies</h2>
					<p>{user?._count.watchNextMovies}</p>
					<ul>
						{user?.watchNextMovies.map(movie => (
							<li key={movie.movie.id}>
								<h3>{movie.movie.title}</h3>
							</li>
						))}
					</ul>
				</div>
			</div>
		</main>
	)
}
