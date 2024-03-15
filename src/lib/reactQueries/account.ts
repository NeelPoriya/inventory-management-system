export const getAccountDetails = async () => {
  const res = await fetch(`/api/info/account`);
  if (!res.ok) {
    throw new Error("Failed to fetch data from server");
  }

  const data = await res.json();
  return data.items[0];
};
