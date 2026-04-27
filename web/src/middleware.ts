import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/chat(.*)",
  "/widget(.*)",
  "/login(.*)",
  "/signup(.*)",
  "/forgot(.*)",
  "/reset(.*)",
  "/invite(.*)",
  "/onboarding(.*)",
  "/api/auth(.*)",
  "/_next(.*)",
]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  if (!isPublicRoute(request) && !(await convexAuth.isAuthenticated())) {
    return nextjsMiddlewareRedirect(request, `/login?next=${encodeURIComponent(request.nextUrl.pathname)}`);
  }
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)"],
};
