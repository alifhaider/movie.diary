import { Form, Link } from '@remix-run/react'
import { ModeToggle } from './mode-toggle'
import { Button } from './ui/button'

const Navbar = ({ isAuthenticated }: { isAuthenticated: Boolean }) => {
	return (
		<header className="container flex justify-between items-center py-10 border-b">
			<div className="w-full">
				<Link to="/">
					<span>Movie</span>
					<span>Diary</span>
				</Link>
			</div>

			<nav className="flex gap-8 items-center">
				<Link to="/movies">Movies</Link>
				{isAuthenticated ? (
          <>
          <Link to="/profile">Profile</Link>
						<Form action="/logout" method="POST">
							<Button variant="secondary" type="submit">
								Logout
							</Button>
						</Form>
					</>
				) : (
					<Link to="/login">Login</Link>
				)}

				<ModeToggle />
			</nav>
		</header>
	)
}

export default Navbar
