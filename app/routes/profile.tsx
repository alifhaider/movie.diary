import { LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { prisma } from '~/db.server'
import { requireUserId } from '~/utils/auth.server'

export async function loader({ request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: {
			username: true,
			email: true,
			image: true,
			watchedMovies: {
				select: {
					movie: {
						select: {
							id: true,
							title: true,
							releaseDate: true,
							description: true,
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
							description: true,
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
	const data = useLoaderData<typeof loader>()
	return (
		<main className="container flex flex-col space-y-10">
			<div className="flex items-center gap-4 space-y-8">
				<div className="w-10 h-10 rounded-md bg-slate-400 mt-10"></div>
				<div>
					<h4 className="text-lg"> @{data?.username}</h4>
					<p className="text-xs">{data?.email}</p>
				</div>
				<div>
					<h2>Watched Movies</h2>
					<p>{data?._count.watchedMovies}</p>
					<ul>
						{data?.watchedMovies.map(movie => (
							<li key={movie.movie.id}>
								<h3>{movie.movie.title}</h3>
							</li>
						))}
					</ul>

					<h2>Watch Next Movies</h2>
					<p>{data?._count.watchNextMovies}</p>
					<ul>
						{data?.watchNextMovies.map(movie => (
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
