import { getSession } from "@/lib/helper";
import chalk from "chalk";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request, response: NextResponse) {
  const session = await getSession();

  console.log(chalk.green(session));

  return NextResponse.json({
    session,
  });
}
