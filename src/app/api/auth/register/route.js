import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";  
import bcrypt from "bcrypt";
import { validateJSONData, validateUserData } from "@/utils/helpers/apiHelpers";

const prisma = new PrismaClient();

// export async function POST(req, options) {
//   //Validera att body är korrekt JSON
//   const [bodyHasErrors, body] = await validateJSONData(req);
//   if (bodyHasErrors) {
//     return NextResponse.json(
//       {
//         message: "A valid JSON object has to be sent",
//       }, {
//         status: 400
//       }
//     )
//   }
//   const [hasErrors, errors] = validateUserData(body);
//   if (hasErrors) {
//     return NextResponse.json(
//       {
//         message: errors,
//       }, {
//         status: 400
//       }
//     );     
//   }
  
//   const existingUser = await prisma.user.findUnique({
//     where: { email: body.email},
//   });

//   if (existingUser) {
//     return NextResponse.json({
//       message: "User already exists"
//     }, {
//       status: 400
//     });
//   }

//   //Hasha lösenordet
//   const hashedPassword = await bcrypt.hash(body.password, 10);
//   // bcrypt kommer att köra hash-algoritmen 2^10 (1024) gånger för varje lösenord.

//   //Försök skapa användare
//   try {
//     const user = await prisma.user.create({
//       data: {
//         name: body.name, 
//         email: body.email,
//         password: hashedPassword,
//       },
//     });
//     return NextResponse.json(
//       user, {
//         status: 201
//       }
//     );
//   } catch (error) {
//     return NextResponse.json({
//       message: "Invalid data sent for user creation",
//     }, {
//       status: 400
//     });
//   }  
// }

export async function POST(req) {
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

  const [hasErrors, errors] = validateUserData(body);
  if (hasErrors) {
    return NextResponse.json(
      {
        message: errors,
      }, {
        status: 400
      }
    );     
  }
  
  const existingUser = await prisma.user.findUnique({
    where: { email: body.email },
  });

  if (existingUser) {
    return NextResponse.json({
      message: "User already exists"
    }, {
      status: 409
    });
  }

  const hashedPassword = await bcrypt.hash(body.password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        name: body.name, 
        email: body.email,
        password: hashedPassword,
      },
    });
    
    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        message: "User created successfully",
      }, {
        status: 201
      }
    );
  } catch (error) {
    return NextResponse.json({
      message: "Invalid data sent for user creation",
    }, {
      status: 400
    });
  }  
}