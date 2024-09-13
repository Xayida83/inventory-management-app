import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { object404Respsonse, validateItemData, validateJSONData } from "@/utils/helpers/apiHelpers";
import { verifyJWT, getAuthHeader} from "@/utils/helpers/authHelpers";

const prisma = new PrismaClient();

//! DELETE
export async function DELETE(req, options) {
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

  // get id from request
  const itemId = options.params.id;

  try {
    await prisma.item.delete(
      {
         where: {
           id: Number(itemId)
           } 
      }
    );

    return NextResponse.json(
      { 
        message: "Item deleted successfully"
      }, {
        status: 200
      }
    );
  } catch (error) {
    return NextResponse.json(
      { 
        message: "Failed to delete item" 
      }, {
        status: 400 
      }
    );
  }
}

export async function PUT(req, options) {
  const id = options.params.id;
  const token = getAuthHeader(req);
  
  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized - No token provided" },
      { status: 401 }
    );
  }

  const decoded = verifyJWT(token);
  if (!decoded) {
    return NextResponse.json(
      { message: "Unauthorized - Invalid or expired token" },
      { status: 401 }
    );
  }

  // Validera JSON-data från begäran
  const [bodyHasErrors, body] = await validateJSONData(req);
  if (bodyHasErrors) {
    console.error("Invalid JSON object received");
    return NextResponse.json({
      message: "Invalid JSON object",
    }, {
      status: 400,
    });
  }

  // Validera item-data
  const [hasErrors, errors] = validateItemData(body);
  if (hasErrors) {
    console.error("Item validation errors:", errors.join(', '));
    return NextResponse.json({
      message:"Validation errors: " + errors.join(', '),
    }, {
      status: 400,
    });
  }

   // Försök att uppdatera item i databasen
   try {
    const updatedItem = await prisma.item.update({
      where: { id: Number(id) },
      data: {
        name: body.name,
        description: body.description,
        quantity: body.quantity,
        category: body.category,
      },
    });
    return NextResponse.json(updatedItem, {message:"Success updating item"},{ status: 200 });
  } catch (error) {
    // Om item inte hittas eller det uppstår andra fel
    console.error("Update failed:", error.message);
    return NextResponse.json({ message: `Update failed: ${error.message}`,}, { status: 404 });
  }
}


//! Read one / GET by id
export async function GET(req, options) {
  const id = options.params.id; 

  try {
    const item = await prisma.item.findUniqueOrThrow({
      where: {id: Number(id)},
    });
    return NextResponse.json(item);
  } catch (error) {
    return object404Respsonse(NextResponse, "Item");    
  }
}

