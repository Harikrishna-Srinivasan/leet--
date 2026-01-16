import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-recommendations`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error("Failed to generate recommendations");
        }

        const data = await response.json();

        return NextResponse.redirect(new URL("/dashboard", req.url));
    } catch (error) {
        console.error("Error generating recommendations:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
