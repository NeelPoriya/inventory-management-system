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
  { name: "Incoming", href: "/dashboard/incoming" },
  { name: "Outgoing", href: "/dashboard/outgoing" },
  { name: "Manage", href: "/dashboard/manage" },
];

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {links.map((link) => {
        return (
          <Link
            key={link.name}
            href={link.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname.includes(link.href)
                ? "text-primary"
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
