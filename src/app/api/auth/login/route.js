import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { signJWT } from "@/utils/helpers/authHelpers";

const prisma = new PrismaClient();

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