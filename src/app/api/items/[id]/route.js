import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { object404Respsonse, validateItemData, validateJSONData } from "@/utils/helpers/apiHelpers";

const prisma = new PrismaClient();

//Read one
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

// Update one
export async function PUT(req, options) {
  const id = options.params.id;

  const [bodyHasErrors, body] = await validateJSONData(req);
  if (bodyHasErrors) {
    return NextResponse.json({
      message: "A valid JSON object has to be sent",
    }, {
      status: 400
    }
  );
  }

  const [hasErrors, errors] = validateItemData(body);
  if (hasErrors) {
    return NextResponse.json({
      message: errors,
    }, {
      status: 400
    });
  }

  try {
    const updatedItem = await prisma.item.update(
      {
        where: { id: Number(id)},
        data: { name: body.name,
          description: body.description,
          quantity: body.quantity,
        },
      }
    );
    return NextResponse.json(updatedItem);
  } catch (error) {
      return object404Respsonse(NextResponse, "Item");
  }
}

// Delete one
export async function DELETE(req, options) {
  //! get id from request
  const id = options.params.id;

  try {
    await prisma.item.delete({ where: { id: Number(id) } });

    return new Response(null, { status: 204 });
  } catch (error) {
    return object404Respsonse(NextResponse, "Item");
  }
}