import { NextResponse } from "next/server";
import { verifyJWT } from "./utils/helpers/authHelpers";

const unsafeMethods = ["POST", "PUT", "DELETE"];

export async function middleware(req) {
  console.log("Middleware is running", req.url.pathname);
  const url = new URL(req.url);
  if (
    unsafeMethods.includes(req.method) ||
    url.pathname.includes("api/users")
  ) {
    console.log("VERIFY");
    try {
      const bearer = req.headers.get("Authorization") || "";
      console.log("Authorization Header:", bearer);

      const token = bearer.split(" ")?.[1]; // get the token from the Authorization header through optional chaining
      if (!token) {
        throw new Error("No token submitted");
      }

      const jwtPayload = await verifyJWT(token);
      console.log("Decoded JWT: ", jwtPayload); // Logga dekodad JWT

      const headers = new Headers(req.headers);
      headers.set("userId", JSON.stringify(jwtPayload.userId));

      return NextResponse.next({ headers: headers });
    } catch (error) {
      return NextResponse.json(
        {
          error: "Unauthorized request",
        },
        { status: 401 }
      );
    }
  }
}

export const config = {
  matcher: [
    "/api/items",    
    "/api/items/:path*"
  ],
};
