import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { signJWT } from "@/utils/helpers/authHelpers";
import { validateJSONData } from "@/utils/helpers/apiHelpers";

const prisma = new PrismaClient();

export async function POST(req) {
  const [bodyHasErrors, body] = await validateJSONData(req);
  if (bodyHasErrors) {
    return NextResponse.json({
      message: "A valid JSON object has to be sent",
    }, {
      status: 400
    });
  }
  const user = await prisma.user.findUnique({
    where: { email: body.email },
  });

  if (!user) {
    return NextResponse.json({
      message: "Invalid email or password",
    }, {
      status: 401,
    });
  }

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

  const token = await signJWT({ userId: user.id, email: user.email });

  return NextResponse.json(
    {
      token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      message: "Login successful",
    },
    {
      status: 200,
    }
  );
  
}