"use client";

import { useState } from "react";

export function ExternalResourceCard({
    title,
    description,
    url,
    type,
    readinessScore = 0,
}) {
    const [isRedirecting, setIsRedirecting] = useState(false);

    const handleRedirect = () => {
        setIsRedirecting(true);
        console.log(`Tracking: User leaving for ${type} - ${url}`);

        setTimeout(() => {
            window.open(url, "_blank");
            setIsRedirecting(false);
        }, 1500);
    };

    const getTypeStyles = () => {
        switch (type) {
            case "github":
                return "bg-gray-100 text-gray-800 dark:bg-neutral-800 dark:text-gray-300";
            case "colab":
                return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
            case "kaggle":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
            case "youtube":
                return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-neutral-800 dark:text-gray-300";
        }
    };

    return (
        <div className="group relative overflow-hidden rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-black p-6 transition-all hover:border-gray-400 dark:hover:border-neutral-600">
            <div className="flex items-start justify-between">
                <div>
                    <span className={`mb-2 inline-block rounded-full px-2 py-1 text-xs font-medium uppercase tracking-wider ${getTypeStyles()}`}>
                        {type}
                    </span>
                    <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {description}
                    </p>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
                <div className="text-xs text-gray-400">
                    {readinessScore > 0 && `Minimum Readiness: ${readinessScore}%`}
                </div>
                <button
                    onClick={handleRedirect}
                    disabled={isRedirecting}
                    className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-all hover:bg-gray-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                >
                    {isRedirecting ? "Redirecting..." : "Open Resource ->"}
                </button>
            </div>

            {isRedirecting && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/90 backdrop-blur-sm dark:bg-black/90">
                    <div className="text-center">
                        <p className="text-sm font-semibold mb-1">Leaving Leet++ Control Plane</p>
                        <p className="text-xs text-gray-500">Launching specialized tool...</p>
                    </div>
                </div>
            )}
        </div>
    );
}
