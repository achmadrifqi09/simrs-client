import {getToken} from 'next-auth/jwt'
import {NextFetchEvent, NextMiddleware, NextRequest, NextResponse} from "next/server";
import moment from "moment-timezone";
import {guestRoutes} from "@/const/routeWithoutPanel";
import {generateCurrentTimestamp} from "@/lib/formatter/date-formatter";

export default function withAuth(
    middleware: NextMiddleware,
) {
    return async (req: NextRequest, next: NextFetchEvent) => {
        const pathname: string = req.nextUrl.pathname

        const isStaticAsset = pathname.startsWith('/_next/') || pathname.startsWith('/static/') || pathname.startsWith('/images');
        const isAllowedPath = guestRoutes.some(path => pathname.startsWith(path));

        const session = await getToken({req, secret: process.env.PUBLIC_NEXTAUTH_SECRET})

        if (!isAllowedPath && !isStaticAsset) {

            if (!session?.accessToken) {
                const url = new URL('/login', req.url);
                return NextResponse.redirect(url);
            }

            if(session?.expires){
                const expired = moment.utc(session.expires);
                const currentTimestamp = moment.utc(generateCurrentTimestamp());
                if (currentTimestamp.isAfter(expired)) {
                    // return NextResponse.redirect(new URL('/api/auth/signout', req.url))
                    return clearSessionAndRedirect(req);
                }
            }

            if (pathname.includes('/login') && session?.accessToken) {
                const url = new URL('/', req.url);
                return NextResponse.redirect(url);
            }
        }

        return middleware(req, next);
    }

}

const clearSessionAndRedirect = (req: NextRequest) => {
    const response = NextResponse.redirect(
        new URL('/login', req.url)
    )

    response.cookies.delete('next-auth.session-token');
    response.cookies.delete('next-auth.session-token.0');
    response.cookies.delete('next-auth.session-token.1');
    response.cookies.delete('next-auth.csrf-token');
    response.cookies.delete('next-auth.callback-url');

    response.headers.set('Clear-Site-Data', '"cookies"');

    return response;
}