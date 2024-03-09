import { updateSession } from "@/lib/helper";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  console.log("Running Middleware.ts");
  return await updateSession(request);
}
