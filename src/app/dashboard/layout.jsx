import Link from "next/link";

export default function DashboardLayout({
    children,
}) {
    return (
        <div className="min-h-screen flex bg-white dark:bg-black">
            {/* Sidebar */}
            <aside className="w-64 border-r border-gray-200 dark:border-neutral-800 p-6 hidden md:block sticky top-0 h-screen">
                <Link href="/" className="block font-bold text-xl mb-10 tracking-tight">
                    Leet++
                </Link>
                <nav className="space-y-4">
                    <NavLink href="/dashboard" active>Overview</NavLink>
                    <NavLink href="/dashboard/tracks">Tracks</NavLink>
                    <NavLink href="/dashboard/projects">Projects</NavLink>
                    <NavLink href="/dashboard/settings">Settings</NavLink>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}

function NavLink({ href, children, active }) {
    return (
        <Link
            href={href}
            className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${active
                ? "bg-gray-100 dark:bg-neutral-900 text-black dark:text-white"
                : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-neutral-900/50"
                }`}
        >
            {children}
        </Link>
    )
}
