import { NextResponse } from "next/server";
import { verifyJWT, getAuthHeader } from "./utils/helpers/authHelpers";

const unsafeMethods = ["POST", "PUT", "DELETE"];

//* middleware loggar varje förfrågning och hämtar URL för att analysera förfrågningsvägen.
export async function middleware(req) {
  console.log("Middleware is running", req.url.pathname); //* Hämtar den aktuella URL-vägen för att kunna kontrollera om det är en väg som kräver autentisering.
  const url = new URL(req.url);

  //* Middleware-funktionen kontrollerar om förfrågan använder en av de "osäkra" metoderna (POST, PUT, eller DELETE), eller om vägen innehåller /api/users. Om så är fallet, initierar den en JWT-verifieringsprocess.
  if (
    unsafeMethods.includes(req.method) ||
    url.pathname.includes("api/users")
  ) {
    console.log("VERIFY");

    try {
      const token = getAuthHeader(req);
       // Använt getAuthHeader för att hämta token
      if (!token) {
        throw new Error("No token submitted");
      }

      const jwtPayload = await verifyJWT(token);
      console.log("Decoded JWT: ", jwtPayload); // Logga dekodad JWT

      //* Om token verifieras, sätts användarens ID (från jwtPayload.userId) i förfrågningens headers.
      const headers = new Headers(req.headers);
      headers.set("userId", JSON.stringify(jwtPayload.userId));

      //* NextResponse.next({ headers: headers }): Fortsätt med förfrågningen och skicka med de uppdaterade headers.
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
//* Denna konfiguration anger vilka vägar middleware ska tillämpas på
export const config = {
  matcher: [
    "/api/items",    
    "/api/items/:path*"
  ],
};
