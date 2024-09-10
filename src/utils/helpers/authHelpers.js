// import jwt from "jsonwebtoken";

// const JWT_SECRET = process.env.JWT_SECRET;

// export function verifyToken(req) {
//   const authHeader = req.headers.get(
//     "Authorization"
//   );

//   if (
//     !authHeader ||
//     !authHeader.startsWith("Bearer ")
//   ) {
//     return [
//       true,
//       "Authorization header missing or malformed",
//     ];
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const secretKey = process.env.JWT_SECRET;
//     if (!secretKey) {
//       throw new Error(
//         "JWT_SECRET is not defined in environment variables"
//       );
//     }
//     const decoded = jwt.verify(token, secretKey);
//     return [false, decoded]; // false betyder att det inte finns några fel
//   } catch (error) {
//     return [true, "Invalid or expired token"];
//   }
// }

// export async function verifyJWT(token) {
//   try {
//     return jwt.verify(token, JWT_SECRET);
//   } catch (error) {
//     // Returnerar null om verifiering misslyckas
//     return null;
//   }
// }

import * as jose from "jose";

const JWT_SECRET = process.env.JWT_SECRET; 

const JWT_AUTH_EXP = "1y"

function encodedSecret() {
    return new TextEncoder().encode(JWT_SECRET)
}

export async function signJWT(payload) {

    const token = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime(JWT_AUTH_EXP)
    .sign(encodedSecret())
    
    return token
}

export async function verifyJWT(token) {

    const verified = await jose.jwtVerify(
        token,
        encodedSecret()
    )
    
    return verified.payload
}