import {
  authApi,
  authRoutes,
  postSigninRedirect,
  publicRoutes,
} from "@/routes";

import NextAuth from "next-auth";
import authConfig from "@/auth.config";

export const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isSignedIn = !!req.auth;

  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isAuthApi = nextUrl.pathname.startsWith(authApi);

  if (isAuthApi) {
    return null;
  }

  if (isAuthRoute) {
    if (isSignedIn) {
      return Response.redirect(new URL(postSigninRedirect, nextUrl));
    } else {
      return null;
    }
  }

  if (!isSignedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(
      new URL(`/signin?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  return null;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
