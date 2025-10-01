import { createContext, useContext, useState } from "react";

const DashboardContext = createContext(null);

export const DashboardProvider = ({ children }) => {
  const [state, setState] = useState({});

  const getValue = (key) => state[key];

  const setValue = (key, value) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };
  return (
    <DashboardContext.Provider value={{ getValue, setValue }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);
