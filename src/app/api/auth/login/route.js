import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { signJWT } from "@/utils/helpers/authHelpers";

// import jwt from "jsonwebtoken";
// import { validateJSONData } from "@/utils/helpers/apiHelpers";

const prisma = new PrismaClient();

// export async function POST(req) {
  
//   const [bodyHasErrors, body] = await validateJSONData(req);
//   if (bodyHasErrors) {
//     return NextResponse.json({
//       message: "A valid JSON object has to be sent",
//     }, {
//       status: 400
//     });
//   }

//   // Hitta användaren i databasen med e-postadressen
//   const user = await prisma.user.findUnique({
//     where: {email: body.email},
//   });

//   if (!user) {
//     return NextResponse.json({
//       message: "Invalid email or password",
//       }, {
//         status: 401,
//       });
//   }

//   // Jämför det inskickade lösenordet med det hashade lösenordet i databasen
//   const isPasswordValid = await bcrypt.compare(body.password, user.password);
//   if (!isPasswordValid) {
//     return NextResponse.json(
//       {
//         message: "Invalid email or password",
//       },
//       {
//         status: 401,
//       });
//   }

//   const token = jwt.sign({
//     userId: user.id, email: user.email
//   },
//   process.env.JWT_SECRET,
//   {
//     expiresIn: "1h", //Token utgångstid
//   });
  
//   return NextResponse.json(
//     {
//       token: token,
//       message: "Login successful",
//     },
//     {
//       status: 200,
//     }
//   );
// }

export async function POST(req) {
  let body; 
  try {
    body = await req.json();

    if (!body.email || !body.password) {
      throw new Error("Email and Password are required")
    }
  } catch (error) {
    return NextResponse.json(
      {
        message: "A valid new user object has to be provided"
      },{
        status: 400
      }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: body.email},
    });

    // Kontrollera om användaren existerar och jämför lösenordet
    if (!user || !(await bcrypt.compare(body.password, user.password))) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }
    // Om lösenordet är korrekt, signera JWT med JOSE
    const token = await signJWT({ userID: user.id });

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token: token,
        message: "Login successfull",
      },{
        status: 200
      }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        error: error.message
      }, {
        status: 400
      }
    );
  }
}