"use client";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function DropdownLogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast.success("Logged out Successfully!");
        router.push("/auth/sign-in");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };
  return <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>;
}
