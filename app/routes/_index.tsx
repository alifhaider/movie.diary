import type { MetaFunction } from '@remix-run/node'
import Navbar from '~/components/Navbar'

export const meta: MetaFunction = () => {
	return [
		{ title: 'New Remix App' },
		{ name: 'description', content: 'Welcome to Remix!' },
	]
}

export default function Index() {
	return (
		<main className="container space-y-20">
			<h1 className="">Make a movie playlist</h1>
		</main>
	)
}
