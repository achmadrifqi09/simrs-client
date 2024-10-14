import { NextRequest, NextResponse } from 'next/server';

const clearSessionAndRedirect = (req: NextRequest) => {
    const response = NextResponse.redirect(
        new URL('/login', req.url)
    );

    const cookiePrefixes = ['next-auth.', 'menu_'];
    const cookies = req.cookies.getAll();

    cookies.forEach(cookie => {
        if (cookiePrefixes.some(prefix => cookie.name.startsWith(prefix))) {
            response.cookies.delete(cookie.name);
        }
    });
    response.headers.set('Clear-Site-Data', '"cookies"');

    return response;
};

const clearClientSideCookies = () => {
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.slice(0, eqPos) : cookie;
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    }
};

export { clearSessionAndRedirect, clearClientSideCookies };