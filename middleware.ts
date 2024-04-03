import { NextResponse } from "next/server";
import { authMiddleware } from "@clerk/nextjs";

// This route is for the intro page for new users
const HOME_ROUTE = "/home";

export default authMiddleware({
  publicRoutes: ["/webhook/clerk", HOME_ROUTE],

  afterAuth(auth, req) {
    // If the user is not signed-in, send them to HOME_ROUTE
    if (!auth.userId && !auth.isPublicRoute) {
      const homeRoute = new URL(HOME_ROUTE, req.url);
      return NextResponse.redirect(homeRoute);
    }

    // If the user is signed-in, send them to app-page
    if (auth.userId && req.nextUrl.pathname === "/home") {
      const appRoute = new URL("/", req.url);
      return NextResponse.redirect(appRoute);
    }

    // Else retun the rquested route
    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
