import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

export default function SignInForm() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [userInput, setUserInput] = React.useState({
    username: "",
    password: "",
  });
  const router = useRouter();

  async function onSubmit(event: React.SyntheticEvent) {
    try {
      event.preventDefault();
      setIsLoading(true);

      const response = await fetch("/api/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInput),
      });

      if (!response.ok) {
        throw new Error("Invalid username or password");
      }

      const data = await response.json();
      toast.success("Logged in successfully!");

      router.push("/");
    } catch (error: any) {
      toast.error(`${error}`);
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
              disabled={isLoading}
              onChange={(e) => {
                setUserInput((prev) => ({
                  ...prev,
                  username: e.target.value,
                }));
              }}
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
                setUserInput((prev) => ({
                  ...prev,
                  password: e.target.value,
                }));
              }}
            />
          </div>
          <div className="mt-4 w-full">
            <Button disabled={isLoading} className="w-full" type="submit">
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign In
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
