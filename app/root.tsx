import { cssBundleHref } from '@remix-run/css-bundle'
import type {
	LinksFunction,
	LoaderFunctionArgs,
	MetaFunction,
} from '@remix-run/node'
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
} from '@remix-run/react'
import stylesheet from '~/tailwind.css'
import clsx from 'clsx'
import { PreventFlashOnWrongTheme, ThemeProvider, useTheme } from 'remix-themes'
import { themeSessionResolver } from './sessions.server'
import Navbar from './components/Navbar'
import { authenticator, requireUserId } from './utils/auth.server'
import { prisma } from './db.server'
import { Toaster } from './components/ui/toaster'

export async function loader({ request }: LoaderFunctionArgs) {
	const userId = await authenticator.isAuthenticated(request)
	const { getTheme } = await themeSessionResolver(request)

	const user = userId
		? await prisma.user.findUnique({
				where: {
					id: userId,
				},
			})
		: null

	if (userId && !user) {
		console.info('User not found in the database, logging out')
		await authenticator.logout(request, { redirectTo: '/login' })
	}
	return {
		theme: getTheme(),
		user,
	}
}

export const links: LinksFunction = () => [
	...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
	{ rel: 'stylesheet', href: stylesheet },
]

export const meta: MetaFunction = ({ location }) => {
	const routeName = location.pathname.split('/')[1].toLocaleUpperCase()
	const title = routeName === '' ? 'Movieary' : `Movieary | ${routeName}`

	return [{ title, description: 'Keep track of your movies' }]
}

export default function AppWithProviders() {
	const data = useLoaderData<typeof loader>()
	return (
		<ThemeProvider specifiedTheme={data.theme} themeAction="/action/set-theme">
			<App />
		</ThemeProvider>
	)
}

export function App() {
	const data = useLoaderData<typeof loader>()
	const [theme] = useTheme()

	const isAuthenticated = Boolean(data.user)
	return (
		<html lang="en" className={clsx(theme)}>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
				<Links />
			</head>
			<body className="min-h-screen flex flex-col">
				<Navbar isAuthenticated={isAuthenticated} />
				<Toaster />
				<Outlet />
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	)
}
