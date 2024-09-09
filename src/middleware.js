import { NextResponse } from "next/server";
import {
  verifyToken,
  verifyJWT,
} from "./utils/helpers/authHelpers";

const unsafeMethods = ["POST", "PUT", "DELETE"];

export async function middleware(req) {
  const url = new URL(req.url);

  if (
    unsafeMethods.includes(req.method) ||
    url.pathname.includes("api/items")
  ) {
    try {
      const [isError, result] = verifyToken(req);
      if (isError) {
        console.log("error: " + result);
      }

      const headers = new Headers(req.headers);
      headers.set(
        "userId",
        JSON.stringify(result)
      );
      return NextResponse.next({
        headers: headers,
      });
    } catch (error) {
      return NextResponse.json(
        {
          error: "Unauthorized request",
        },
        {
          status: 401,
        }
      );
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/items",
    "/api/items/:path*", // Applicera på alla items-relaterade rutter
  ],
};
