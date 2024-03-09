"use client";
import { useEffect, useState } from "react";

export default async function SettingsProfilePage() {
  const [userDetails, setUserDetails] = useState<{
    username: string;
    name: string;
  }>({
    username: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      // const session = await getSession();
      // const response = await fetch(`$/user/${session.user.id}`, {
      //   headers: {
      //     Authorization: `Bearer ${session.accessToken}`,
      //   },
      // });
      // const data = await response.json();
      // setUserDetails({
      //   username: data.username,
      //   name: data.name,
      // });
      setLoading(false);
    };

    fetchUserDetails();
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          Edit your username and name.
        </p>
      </div>
    </div>
  );
}
