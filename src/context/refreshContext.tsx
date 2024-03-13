import { createContext } from "react";

export const RefreshContext = createContext({
  value: false,
  toggle: () => {},
});
