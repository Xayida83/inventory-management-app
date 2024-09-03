import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validateJSONData } from "@/utils/helpers/apiHelpers";

const prisma = new PrismaClient();

export async function POST(req, options) {
  const [bodyHasErrors, body] = await validateJSONData(req);
  if (bodyHasErrors) {
    return NextResponse.json({
      message: "A valid JSON object has to be sent",
    }, {
      status: 400
    });
  }

  const user = await prisma.user.findUnique({
    where: {email: body.email},
  });

  if (!user) {
    return NextResponse.json({
      message: "Invalid email or password",
      }, {
        status: 401,
      });
  }

  // Jämför det inskickade lösenordet med det hashade lösenordet i databasen
  const isPasswordValid = await bcrypt.compare(body.password, user.password);
  if (!isPasswordValid) {
    return NextResponse.json(
      {
        message: "Invalid email or password",
      },
      {
        status: 401,
      });
  }

  const token = jwt.sign({
    userId: user.id, email: user.email
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "1h", //Token utgångstid
  });
  
  return NextResponse.json(
    {
      token: token,
      message: "Login successful",
    },
    {
      status: 200,
    }
  );
}
