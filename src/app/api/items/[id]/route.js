import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { object404Respsonse, validateItemData, validateJSONData } from "@/utils/helpers/apiHelpers";
import { verifyJWT } from "@/utils/helpers/authHelpers";

const prisma = new PrismaClient();

//! DELETE
export async function DELETE(req, options) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  const decoded = await verifyJWT(token)

  if (!decoded) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
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

//! PUT / UPDATE
// export async function PUT(req, options) {
//   const id = options.params.id;

//   const [bodyHasErrors, body] = await validateJSONData(req);
//   if (bodyHasErrors) {
//     return NextResponse.json({
//       message: "A valid JSON object has to be sent",
//     }, {
//       status: 400
//     }
//   );
//   }

//   const [hasErrors, errors] = validateItemData(body);
//   if (hasErrors) {
//     return NextResponse.json({
//       message: errors,
//     }, {
//       status: 400
//     });
//   }

//   try {
//     const updatedItem = await prisma.item.update(
//       {
//         where: { id: Number(id)},
//         data: { name: body.name,
//           description: body.description,
//           quantity: body.quantity,
//           category: body.category,
//         },
//       }
//     );
//     return NextResponse.json(updatedItem);
//   } catch (error) {
//       return object404Respsonse(NextResponse, "Item");
//   }
// }
export async function PUT(req, options) {
  const id = options.params.id;
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

  // Validera JSON-data från begäran
  const [bodyHasErrors, body] = await validateJSONData(req);
  if (bodyHasErrors) {
    return NextResponse.json({
      message: "A valid JSON object has to be sent",
    }, {
      status: 400,
    });
  }

  // Validera item-data
  const [hasErrors, errors] = validateItemData(body);
  if (hasErrors) {
    return NextResponse.json({
      message: errors.join(', '),
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
    return NextResponse.json(updatedItem, { status: 200 });
  } catch (error) {
    // Om item inte hittas eller det uppstår andra fel
    return NextResponse.json({ message: "Item not found or update failed" + error.message }, { status: 404 });
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

