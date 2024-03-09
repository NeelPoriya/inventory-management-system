import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

export default function SignUpForm() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [userInput, setUserInput] = React.useState({
    username: "",
    password: "",
    name: "",
  });
  const router = useRouter();

  async function onSubmit(event: React.SyntheticEvent) {
    try {
      setIsLoading(true);
      event.preventDefault();
      const response = await fetch("/api/info/account/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInput),
      });

      if (!response.ok) {
        throw new Error("Failed to create account");
      }
      toast.success("Account Created!");

      router.push("/auth/sign-in");
    } catch (error) {
      toast.error("Failed to create account");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("grid gap-6")}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Username
            </Label>
            <Input
              id="username"
              placeholder="Username"
              type="text"
              autoCapitalize="none"
              autoComplete="name"
              autoCorrect="off"
              onChange={(e) => {
                setUserInput((prev) => ({ ...prev, username: e.target.value }));
              }}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Password
            </Label>
            <Input
              id="password"
              placeholder="Password"
              type="password"
              disabled={isLoading}
              onChange={(e) => {
                setUserInput((prev) => ({ ...prev, password: e.target.value }));
              }}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Account Name"
              type="text"
              disabled={isLoading}
              onChange={(e) => {
                setUserInput((prev) => ({ ...prev, name: e.target.value }));
              }}
            />
          </div>
          <div className="mt-4 w-full">
            <Button disabled={isLoading} className="w-full" type="submit">
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign Up
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
