// Serves the home page of studio.emirucgun.com from /studio (see studio/).
//
// Only "/" needs this. Every other studio path is handled by the host-scoped rewrite in
// vercel.json, but Vercel applies those rewrites after checking the filesystem, so for "/"
// the main site's index.html would always win. Routing Middleware runs before that check.
//
// It runs on "/" only. On any other host (emirucgun.com, www, previews) it returns
// nothing and the request continues exactly as before.
export const config = { matcher: '/', runtime: 'edge' };

export default function middleware(request) {
  const url = new URL(request.url);
  if (url.hostname !== 'studio.emirucgun.com') return;
  return new Response(null, {
    headers: { 'x-middleware-rewrite': new URL('/studio' + url.search, url).toString() }
  });
}
