import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const ALLOWED_DOMAINS =
  "*.vercel.live vercel.live *.vercel.com vercel.com *.pusher.com pusher.com wss://*.pusher.com wss://pusher.com";

const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  const isDevEnv = process.env.NODE_ENV === "development";
  const isPrevEnv = process.env?.VERCEL_ENV === "preview";

  const devEnv = isDevEnv ? "'unsafe-eval'" : "";

  const prevEnv = isPrevEnv
    ? `${ALLOWED_DOMAINS} 'unsafe-inline'`
    : `'nonce-${nonce}'`;

  const noNoncePrevEnv = isPrevEnv ? `${ALLOWED_DOMAINS} 'unsafe-inline'` : "";

  /** Backwards compatibility at script-src: 'unsafe inline' is ignored if there's a nonce or hash in CSP2+.
   * It's also ignored in CSP3 if there's 'strict-dynamic'.
   * http: and https: are also ignored in CSP3+ if there's 'strict-dynamic'. */

  // TODO: Check style-src 'self' ${prevEnv};

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' http: https: 'nonce-${nonce}' ${
    isPrevEnv ? "" : "strict-dynamic"
  } ${devEnv} ${noNoncePrevEnv};
    style-src 'self' ${ALLOWED_DOMAINS} 'unsafe-inline';
    img-src 'self' blob: data: ${noNoncePrevEnv};
    font-src 'self';
    connect-src 'self' ${prevEnv};
    frame-src 'self' ${prevEnv};
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    ${!isDevEnv ? "upgrade-insecure-requests;" : ""}
  `
    .replace(/\s{2,}/g, " ")
    .trim();

  const cspWithNonce = cspHeader;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", cspWithNonce);

  const req = new NextRequest(request, {
    headers: requestHeaders,
  });

  const response: NextResponse = intlMiddleware(req);
  response.headers.set("Content-Security-Policy", cspWithNonce);

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|images|favicon.ico|icon.ico|apple-icon.png|manifest.webmanifest).*)",
  ],
};
