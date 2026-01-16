import { signIn } from "@/auth";

export default function LoginPage() {
    return (
        <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-black">
            <div className="w-full max-w-sm space-y-6 rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-black p-8 shadow-xl">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold tracking-tighter">Welcome Back</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Enter your credentials to continue to the platform.
                    </p>
                </div>
                <div className="space-y-4">
                    <form
                        action={async () => {
                            "use server";
                            await signIn("github", { redirectTo: "/dashboard" });
                        }}
                    >
                        <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-black p-3 font-medium text-white transition hover:opacity-80 dark:bg-white dark:text-black">
                            Sign in with GitHub
                        </button>
                    </form>
                    <form
                        action={async () => {
                            "use server";
                            await signIn("google", { redirectTo: "/dashboard" });
                        }}
                    >
                        <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-3 font-medium text-black transition hover:bg-gray-50 dark:border-neutral-800 dark:bg-black dark:text-white dark:hover:bg-neutral-900">
                            Sign in with Google
                        </button>
                    </form>
                </div>
                <p className="text-center text-xs text-gray-500">
                    By clicking continue, you agree to our{" "}
                    <span className="underline hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer">
                        Terms of Service
                    </span>{" "}
                    and{" "}
                    <span className="underline hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer">
                        Privacy Policy
                    </span>
                    .
                </p>
            </div>
        </div>
    );
}
