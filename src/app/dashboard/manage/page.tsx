"use client";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAccountDetails } from "@/lib/reactQueries/account";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SettingsProfilePage() {
  const router = useRouter();

  const [userDetails, setUserDetails] = useState<{
    _id: string;
    username: string;
    name: string;
  }>({
    _id: "",
    username: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["account"],
    queryFn: getAccountDetails,
  });

  useEffect(() => {
    if (data) {
      setUserDetails(data);
    }
  }, [data]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/info/account/${userDetails._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
      });

      if (!response.ok) {
        if (response.status === 401) router.push("/auth/sign-in");
        throw new Error("Failed to update user details");
      }

      toast.success("User details updated successfully");
    } catch (error: any) {
      console.error(error);
      toast.error(`${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          Edit your username and name.
        </p>
      </div>
      {isLoading && (
        <div className="flex items-center justify-center">
          <Loader className="animate-spin" />
        </div>
      )}
      {!isLoading && (
        <form action={handleSubmit} className="flex flex-col gap-2">
          <div>
            <Label>Account Name</Label>
            <Input
              placeholder={userDetails.name}
              type="text"
              required={true}
              id="name"
              value={userDetails.name}
              onChange={(e) =>
                setUserDetails((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
          <div>
            <Label>Username</Label>
            <Input
              placeholder={userDetails.username}
              type="text"
              required={true}
              id="username"
              value={userDetails.username}
              onChange={(e) =>
                setUserDetails((prev) => ({
                  ...prev,
                  username: e.target.value,
                }))
              }
            />
          </div>
          <div className="flex flex-row-reverse">
            <Button type="submit">
              {loading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {!loading && "Submit"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
