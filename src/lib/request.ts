import { useRouter } from "next/navigation";
import { AuthenticationError } from "./errors/auth";

export const get = async (
  url: string
): Promise<any | typeof AuthenticationError | typeof Error> => {
  const res = await fetch(url);

  if (res.status === 401) {
    throw new AuthenticationError("Unauthorized");
  }

  if (!res.ok) {
    throw new Error("Failed to fetch data from server");
  }

  return res.json();
};

export const post = async (
  url: string,
  body: any
): Promise<any | typeof AuthenticationError | typeof Error> => {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (res.status === 401) {
    throw new AuthenticationError("Unauthorized");
  }

  if (!res.ok) {
    throw new Error("Failed to fetch data from server");
  }

  return res.json();
};
