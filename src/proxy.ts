import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Routes that require a logged-in user.
// Everything else — including the lookup, learn section, and daily challenge — is public.
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/collection(.*)",
  "/api/collection(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Run on all routes except Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
