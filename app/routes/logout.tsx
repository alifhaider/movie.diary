import { LoaderFunctionArgs, redirect } from '@remix-run/node'
import { authenticator } from '~/utils/auth.server'

export async function action({ request }: LoaderFunctionArgs) {
	await authenticator.logout(request, { redirectTo: '/' })
}

export async function loader() {
	return redirect('/')
}
