import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { validateItemData, validateJSONData } from "@/utils/helpers/apiHelpers";

const prisma = new PrismaClient();

// Create
export async function POST(req){
  //Validera att body är korrekt JSON
  const [bodyHasErrors, body] = await validateJSONData(req);
  if (bodyHasErrors) {
    return NextResponse.json(
      {
        message: "A valid JSON object has to be sent",
      }, {
        status: 400
      }
    )
  }

  // Validera inkommande data
  const [hasErrors, errors] = validateItemData(body);
  if (hasErrors) {
    return NextResponse.json(
      {
        message: errors,
      }, {
        status: 400
      }
    );     
  }
  // Försöker skapa objektet
  try {
    const item = await prisma.item.create({
      data: {
        name: body.name,
        description: body.description,
        quantity: body.quantity,
      },
    });
    return NextResponse.json(
      item, 
      {
      status: 201
      });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Invalid data sent for item creation",
      }, {
        status: 400
      }
    );
  }
}

// Read
export async function GET(req) {
  let items = await prisma.item.findMany();
  //TODO Lägg till filtrering här

  return NextResponse.json(
    items, 
    {
      status:200,
    });  
}

