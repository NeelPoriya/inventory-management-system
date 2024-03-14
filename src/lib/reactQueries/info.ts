export const getWeekInfo = async () => {
  const response = await fetch("/api/unrest/graph/week/combined");
  if (!response.ok) {
    throw new Error("Failed to fetch data from server");
  }
  const data = await response.json();

  return data.items;
};

export const getMonthInfo = async () => {
  const response = await fetch("/api/unrest/graph/month/combined");
  if (!response.ok) {
    throw new Error("Failed to fetch data from server");
  }
  const data = await response.json();

  return data.items;
};
