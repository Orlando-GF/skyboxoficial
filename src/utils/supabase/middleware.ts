import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
    try {
        let response = NextResponse.next({
            request: {
                headers: request.headers,
            },
        });

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return response;
        }

        const supabase = createServerClient(
            supabaseUrl,
            supabaseKey,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll();
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value }) =>
                            request.cookies.set(name, value)
                        );
                        response = NextResponse.next({
                            request,
                        });
                        cookiesToSet.forEach(({ name, value, options }) =>
                            response.cookies.set(name, value, options)
                        );
                    },
                },
            }
        );

        const {
            data: { user },
        } = await supabase.auth.getUser();

        // Protect /admin routes
        if (request.nextUrl.pathname.startsWith("/admin")) {
            if (!user) {
                return NextResponse.redirect(new URL("/login", request.url));
            }
        }

        // Redirect /login to /admin if already logged in
        if (request.nextUrl.pathname === "/login") {
            if (user) {
                return NextResponse.redirect(new URL("/admin", request.url));
            }
        }

        return response;
    } catch (error) {
        console.error("Critical Middleware Error:", error);
        return NextResponse.next();
    }
}
