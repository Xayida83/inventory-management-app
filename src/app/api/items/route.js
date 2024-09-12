import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyJWT, getAuthHeader } from "@/utils/helpers/authHelpers";  // Importera JWT-verifieringsfunktionen

const prisma = new PrismaClient();

//! GET
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
    //* Filtrera items baserat på kategori och lagerstatus
    const items = await prisma.item.findMany({
      where: {
        //* Filtrera om en kategori anges
        ...(category && {
          category: {
            contains: category, //* Använd "contains" för att matcha delvis
            mode: "insensitive", //* Gör sökningen skiftlägesokänslig
          },
        }),
        //* Filtrera efter lagerstatus om "inStock" är true
        ...(inStock && {
          quantity: {
            gt: 0,  //* Om inStock är true, välj bara items med quantity > 0
          },
        })
      },
    });

    return NextResponse.json(
      items, { 
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
      {
        item: newItem, 
        message: "Created item successfully" 
      }, 
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