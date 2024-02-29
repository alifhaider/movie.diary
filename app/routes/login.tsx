import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node'
import { useFetcher, useLoaderData, useSearchParams } from '@remix-run/react'
import { GeneralErrorBoundary } from '~/components/error-boundary'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { commitSession, getSession } from '~/sessions.server'
import { authenticator } from '~/utils/auth.server'

export async function loader({ request }: LoaderFunctionArgs) {
	await authenticator.isAuthenticated(request, {
		successRedirect: '/',
	})
	const session = await getSession(request.headers.get('cookie'))
	const error = session.get(authenticator.sessionErrorKey)
	let errorMessage: string | null = null
	if (typeof error?.message === 'string') {
		errorMessage = error.message
	}
	return json(
		{ formError: errorMessage },
		{
			headers: {
				'Set-Cookie': await commitSession(session),
			},
		},
	)
}

export async function action({ request }: ActionFunctionArgs) {
	return authenticator.authenticate('sign-in', request, {
		successRedirect: '/',
		failureRedirect: '/login',
	})
}

export default function Login() {
	return (
		<main className="container flex-1 h-full flex flex-col items-center justify-center">
			<Card className="max-w-xl w-full">
				<CardHeader>
					<CardTitle className="text-center">Login</CardTitle>
				</CardHeader>
				<CardContent>
					<form method="post" action="/login" className="space-y-8">
						<div>
							<Label htmlFor="username">Username</Label>
							<Input type="text" name="username" required />
						</div>
						<div>
							<Label htmlFor="password">Password</Label>
							<Input type="password" name="password" required />
						</div>

						<div className="flex justify-center items-center">
							<Button className="mx-auto" type="submit">
								Login
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</main>
	)
}

export function ErrorBoundary() {
	return <GeneralErrorBoundary />
}
