import {getToken, JWT} from 'next-auth/jwt'
import {NextFetchEvent, NextMiddleware, NextResponse} from "next/server";
import moment from "moment-timezone";
import {guestRoutes} from "@/const/routeWithoutPanel";
import {generateCurrentTimestamp} from "@/lib/formatter/date-formatter";
import {decompressFromBase64} from "lz-string";
import {clearSessionAndRedirect} from "@/utils/cookies-cleaner";
import {NextRequestWithAuth} from "next-auth/middleware";

export default function withAuth(
    middleware: NextMiddleware,
) {
    return async (req: NextRequestWithAuth, next: NextFetchEvent) => {
        const pathname: string = req.nextUrl.pathname
        if (pathname === '/not-found' || pathname.includes('manifest') || pathname.includes('icons')) {
            return middleware(req, next);
        }

        const isStaticAsset = pathname.startsWith('/_next/') || pathname.startsWith('/static/') || pathname.startsWith('/images');
        const isAllowedPath = guestRoutes.some(path => pathname.startsWith(path));

        const session: JWT | null = await getToken({req, secret: process.env.PUBLIC_NEXTAUTH_SECRET})

        if(session && pathname.startsWith('/auth/login')) {
            return NextResponse.redirect(new URL('/', req.url));
        }

        if (isStaticAsset || isAllowedPath) {
            return middleware(req, next);
        }

        if (!session?.accessToken) {
            return NextResponse.redirect(new URL('/auth/login', req.url));
        }

        if (session.expires) {
            const expired = moment.utc(session.expires);
            const currentTimestamp = moment.utc(generateCurrentTimestamp());
            if (currentTimestamp.isAfter(expired)) {
                const response = NextResponse.redirect(
                    new URL('/auth/login', req.url)
                )

                response.cookies.delete('next-auth.session-token')
                response.cookies.delete('next-auth.csrf-token')
                response.cookies.delete('next-auth.callback-url')

                return response
            }
        }

        const cookieMenus = req.cookies.get('menu_paths')?.value
        if (cookieMenus) {
            const menus: string[] = JSON.parse(decompressFromBase64(cookieMenus) || '[]');
            if (cookieMenus) {
                if (Array.isArray(menus)) {
                    const isPathAllowed = checkPath(pathname, menus);
                    if (!isPathAllowed && pathname !== '/') {
                        return NextResponse.redirect(new URL('/not-found', req.url));
                    }
                    return middleware(req, next);
                }
            } else {
                clearSessionAndRedirect(req);
            }
        }
    }
}

function checkPath(path: string, menuPaths: string[]) {
    const normalizedPath = path.endsWith('/') ? path.slice(0, -1) : path;

    for (const pattern of menuPaths) {
        const normalizedPattern = pattern.endsWith('/') ? pattern.slice(0, -1) : pattern;

        const pathSegments = normalizedPath.split('/').filter(Boolean);
        const patternSegments = normalizedPattern.split('/').filter(Boolean);

        if (pathSegments.length >= patternSegments.length) {
            let match = true;
            for (let i = 0; i < patternSegments.length; i++) {
                if (pathSegments[i] !== patternSegments[i]) {
                    match = false;
                    break;
                }
            }
            if (match && (pathSegments.length <= patternSegments.length + 1)) {
                return true;
            }
        }
    }

    return false;
}
