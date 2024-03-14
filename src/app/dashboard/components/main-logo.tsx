import { getSession } from "@/lib/helper";
import { Pencil, Workflow } from "lucide-react";
import Link from "next/link";

export default async function MainLogo() {
  const session = await getSession();

  const username: string = session?.user?.name || "User";
  const userInitials = username
    .split(" ")
    .map((n) => n[0].toUpperCase())
    .join("");

  return (
    <Link href="/dashboard/overview">
      <div className="flex items-center">
        <Workflow className="mr-3" />
        {username}
      </div>
    </Link>
  );
}
