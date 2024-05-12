"use client";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

type Link = {
  name: string;
  href: string;
};

const links = [
  { name: "Overview", href: "/dashboard/overview" },
  { name: "Inward", href: "/dashboard/inward" },
  { name: "Outward", href: "/dashboard/outward" },
  {
    name: "List",
    href: "/dashboard/list",
  },
  { name: "Manage", href: "/dashboard/manage" },
  { name: "Report", href: "/dashboard/report" },
  // { name: "Invoice", href: "/dashboard/invoice" },
];

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  return (
    <nav className={cn("flex items-center space-x-2", className)} {...props}>
      {links.map((link) => {
        return (
          <Link
            key={link.name}
            href={link.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary select-none hover:bg-muted px-3 py-2 rounded-lg",
              pathname.includes(link.href)
                ? "text-background bg-primary"
                : "text-muted-foreground"
            )}
          >
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}
