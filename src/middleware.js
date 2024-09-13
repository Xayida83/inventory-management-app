import { NextResponse } from "next/server";
import { verifyJWT, getAuthHeader } from "./utils/helpers/authHelpers";

const unsafeMethods = ["POST", "PUT", "DELETE"];

//* middleware loggar varje förfrågning och hämtar URL för att analysera förfrågningsvägen.
//* Hämtar den aktuella URL-vägen för att kunna kontrollera om det är en väg som kräver autentisering.
//* Ansvarar för att kontrollera om tokenen är giltig innan användaren får åtkomst

export async function middleware(req) {
  // Använd getAuthHeader för att extrahera token från request
  const token = getAuthHeader(req); 

  if (!token) {
    // Returnera 401 Unauthorized om ingen token hittas
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Verifiera JWT-token
  const payload = await verifyJWT(token);

  if (!payload) {
    // Returnera 401 Unauthorized om token är ogiltig
    return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
  }

  // Om JWT verifieras, lägg till användarens ID i headers
  const headers = new Headers(req.headers);
  headers.set("userId", payload.userId);

  // Skicka vidare förfrågan med uppdaterade headers
  return NextResponse.next({ headers });
}


//* Denna konfiguration anger vilka vägar middleware ska tillämpas på
export const config = {
  matcher: [
    "/api/items",    
    "/api/items/:path*"
  ],
};
