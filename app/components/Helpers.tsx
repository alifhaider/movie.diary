export function PageTitle({ children }: { children: React.ReactNode }) {
	return <h1 className="text-7xl font-bold">{children}</h1>
}

export function Layout({ children }: { children: React.ReactNode }) {
	return <main className="container space-y-20 py-10">{children}</main>
}
