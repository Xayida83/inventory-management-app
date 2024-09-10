import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyJWT } from "@/utils/helpers/authHelpers";  // Importera JWT-verifieringsfunktionen

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
  //TODO gör till en egen funktion användning ett
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      {
        message: "Unauthorized"
      }, {
        status: 401
      }
    );    
  }

  const token = authHeader.split(" ")[1];
  const decoded = await verifyJWT(token);
  if (!decoded) {
    return NextResponse.json(
      {
        message: "Unauthorized"
      },{
        status: 401
      }
    );
  }
  // funktion ned hit

  try {
    const items = await prisma.item.findMany();
    return NextResponse.json(
      items, 
      { 
        status: 200 
      });
  } catch (error) {
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
// export async function POST(req){

//   const [tokenError, decoded] = verifyToken(req);
//   if (tokenError) {
//     console.log("Token verification failed:", tokenError.message);
//     return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
//   }
  
//   //Validera att body är korrekt JSON
//   const [bodyHasErrors, body] = await validateJSONData(req);
//   if (bodyHasErrors) {
//     return NextResponse.json(
//       {
//         message: "A valid JSON object has to be sent",
//       }, {
//         status: 400
//       }
//     );
//   }

//   // Validera inkommande data
//   const [hasErrors, errors] = validateItemData(body);
//   if (hasErrors) {
//     return NextResponse.json(
//       {
//         message: errors.join(', ') //Retunerar felen som en lista
//       }, {
//         status: 400
//       }
//     );     
//   }

//   // Försöker skapa item
//   try {
//     const item = await prisma.item.create({
//       data: {
//         name: body.name,
//         description: body.description,
//         quantity: body.quantity,
//         category: body.category,
//       },
//     });
//     return NextResponse.json(
//       item, 
//       {
//       status: 201
//       });
//   } catch (error) {
//     return NextResponse.json(
//       {
//         message: "Invalid data sent for item creation",
//       }, {
//         status: 400
//       }
//     );
//   }
// }

export async function POST(req) {
  //TODO gör till en egen funktion användning 2
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      {
        message: "Unauthorized"
      }, {
        status: 401
      }
    );
  }

  const token = authHeader.split(" ")[1];
  const decoded = await verifyJWT(token);

  if (!decoded) {
    return NextResponse.json(
      {
        message: "Unauthorized"
      },{
        status: 401
      }
    );
  }
  //egen funktion hit

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