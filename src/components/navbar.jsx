import Link from 'next/link';
import { auth, signOut } from "@/auth";

export async function Navbar() {
    const session = await auth();

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-border bg-background/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="font-bold text-xl tracking-tight hover:opacity-80 transition-opacity">
                    Leet<span className="text-muted-foreground">++</span>
                </Link>
                <div className="flex items-center gap-8 text-sm font-medium">
                    <Link href="/track" className="text-muted-foreground hover:text-foreground transition-colors">
                        Tracks
                    </Link>
                    <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                        Philosophy
                    </Link>
                    {session?.user ? (
                        <div className="flex items-center gap-6">
                            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                                Dashboard
                            </Link>
                            <form
                                action={async () => {
                                    "use server";
                                    await signOut();
                                }}
                            >
                                <button className="text-red-500 hover:text-red-600 font-medium transition-colors cursor-pointer">
                                    Sign Out
                                </button>
                            </form>
                            <div className="h-8 w-8 rounded-full bg-linear-to-tr from-gray-200 to-gray-400 dark:from-neutral-800 dark:to-neutral-600 ring-2 ring-border shadow-inner" />
                        </div>
                    ) : (
                        <Link href="/login/oauth" className="px-5 py-2 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all hover:scale-[1.02] shadow-sm">
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
