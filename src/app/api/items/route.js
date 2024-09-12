import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyJWT, getAuthHeader } from "@/utils/helpers/authHelpers";  // Importera JWT-verifieringsfunktionen

// import { validateItemData, validateJSONData } from "@/utils/helpers/apiHelpers";
// import { verifyToken } from "@/utils/helpers/authHelpers";

const prisma = new PrismaClient();

//! GET
// export async function GET(req) {

//   const [tokenError, decoded] = verifyToken(req);
//   if (tokenError) {
//     console.log("Token verification failed:", tokenError.message);
//     return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
//   }
  
//   // Läs query-params för filtrering (om det finns)
//   const url = new URL(req.url);
//   const categories = url.searchParams.getAll("categories"); // För kategorifiltrering
//   const inStock = url.searchParams.get("inStock"); // Lagerstatus (true/false)

//   let where = {};

//   // Filtrera på kategorier om de är angivna
//   if (categories.length > 0) {
//     where.category = { in: categories };
//   }

//   // Filtrera på lagerstatus (om items finns i lager)
//   if (inStock !== null) {
//     where.quantity = inStock === "true" ? { gt: 0 } : { eq: 0 };
//   }

//   try {
//     const items = await prisma.item.findMany();
//     return NextResponse.json(items, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
//   }
// }

export async function GET(req) {
  const token = getAuthHeader(req);
  
  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const decoded = verifyJWT(token);
  if (!decoded) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const url = new URL(req.url);
  const category = url.searchParams.get("category") || ""; // Om ingen kategori anges, använd tom sträng
  const inStock = url.searchParams.get("inStock") === "true"; // Konvertera inStock till boolean

  try {
    // Filtrera items baserat på kategori och lagerstatus
    const items = await prisma.item.findMany({
      where: {
        // Filtrera om en kategori anges
        ...(category && {
          category: {
            contains: category, // Använd "contains" för att matcha delvis
            mode: "insensitive", // Gör sökningen skiftlägesokänslig
          },
        }),
        // Filtrera efter lagerstatus om "inStock" är true
        ...(inStock && {
          quantity: {
            gt: 0,  // Om inStock är true, välj bara items med quantity > 0
          },
        })
      },
    });

    return NextResponse.json(
      items, 
      { 
        status: 200 
      });
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json(
      {
        message: "Something went wrong"
      }, {
        status: 500
      }
    );
  }
}

//! POST

export async function POST(req) {
  const token = getAuthHeader(req);
  
  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const decoded = verifyJWT(token);
  if (!decoded) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();

    const newItem = await prisma.item.create({
      data: {
        name: body.name,
        description: body.description,
        quantity: body.quantity,
        category: body.category,
      },
    });

    return NextResponse.json(
      newItem,
      {
        status: 201
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Invalid data sent for item creation"
      }, {
        status: 400
      }
    );
  }
}