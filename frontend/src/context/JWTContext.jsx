import { createContext, useContext, useState, useEffect } from "react";
const JwtContext = createContext();

export const useJwt = () => useContext(JwtContext);

export function JwtProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("jwt") || "");

  useEffect(() => {
    localStorage.setItem("jwt", token);
  }, [token]);

  return (
    <JwtContext.Provider value={{ token, setToken }}>
      {children}
    </JwtContext.Provider>
  );
}
