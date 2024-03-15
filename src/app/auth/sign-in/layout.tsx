import { ModeToggle } from "@/components/theme-switch-button";
import { getSession } from "@/lib/helper";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="w-full h-screen">
      <div className="container relative hidden h-full flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        {children}
      </div>
      <div className="fixed bottom-2 right-2">
        <ModeToggle />
      </div>
    </div>
  );
}
