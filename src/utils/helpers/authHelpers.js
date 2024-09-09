import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function verifyToken(req) {
  const authHeader = req.headers.get(
    "Authorization"
  );

  if (
    !authHeader ||
    !authHeader.startsWith("Bearer ")
  ) {
    return [
      true,
      "Authorization header missing or malformed",
    ];
  }

  const token = authHeader.split(" ")[1];

  try {
    // Ensure that the secret is correctly loaded from the environment
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      throw new Error(
        "JWT_SECRET is not defined in environment variables"
      );
    }
    const decoded = jwt.verify(token, secretKey);
    return [false, decoded]; // false betyder att det inte finns några fel
  } catch (error) {
    return [true, "Invalid or expired token"];
  }
}

export async function verifyJWT(token) {
  try {
    // Verifierar JWT-token med hjälp av din hemliga nyckel
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    // Returnerar null om verifiering misslyckas
    return null;
  }
}
