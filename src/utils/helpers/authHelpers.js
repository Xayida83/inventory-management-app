import * as jose from "jose";

const JWT_SECRET = process.env.JWT_SECRET; 

const JWT_AUTH_EXP = "1h"

function encodedSecret() {
    return new TextEncoder().encode(JWT_SECRET)
}

//* signJWT: Skapar ett nytt JWT-token med en payload, signerat med en hemlig nyckel och en giltighetstid.
export async function signJWT(payload) {

    const token = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime(JWT_AUTH_EXP)
    .sign(encodedSecret())
    
    return token
}
//*verifyJWT: Verifierar JWT-token och returnerar payloaden om token är giltigt.
export async function verifyJWT(token) {
    try {
        const { payload } = await jose.jwtVerify(
            token, 
            encodedSecret()
        );
        return payload;
    } catch (error) {
        console.error("Invalid or expired token", error);
        return null; // Returnera null om verifieringen misslyckas
    }
    
}

export function getAuthHeader(req) {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }
    const token = authHeader.split(" ")[1];
    return token;
}

//* encodedSecret(): Funktionen kodar den hemliga nyckeln (JWT_SECRET) som används för att signera och verifiera JWT-tokens.
//* signJWT(payload): Skapar och signerar ett JWT med en specifik payload, typ (JWT), algoritm (HS256), och en utgångstid.
//* verifyJWT(token): Verifierar en JWT-token genom att kontrollera signaturen med den hemliga nyckeln och returnerar payload om verifieringen lyckas.