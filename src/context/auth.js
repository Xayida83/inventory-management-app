"use client";

import { createContext, useContext, useEffect, useState } from "react";

//* defaultState definierar ett standardvärde för AuthContext som har användarens information (user), token (token), och funktioner för att uppdatera token (setToken) samt logga ut (logout).
const defaultState = {
  user: null,
  token: null,
  setToken: () => {},
  logout: () => {}
};

//* AuthContext skapas med hjälp av createContext(), vilket gör det möjligt att dela autentiseringsdata (token och användarstatus) över alla komponenter i applikationen.
const AuthContext = createContext(defaultState);

//* AuthProvider är en komponent som omsluter delar av applikationen och gör kontexten tillgänglig för dess barnkomponenter.
function AuthProvider({ children }) {
  const [token, setTokenState] = useState(defaultState.token);
  //* setTokenState används för att uppdatera tokenens värde när den ändras.

  //* Detta innebär att om en användare laddar om sidan eller återvänder efter att ha varit inloggad, kommer deras token att laddas från localStorage och de kan förbli inloggade.
  useEffect(() => {
    const _token = localStorage.getItem("@inventory/token");
    // console.log("Retrieved token from localStorage:", _token);
    if (_token) {
      setTokenState(_token); 
    }
  }, []);

  //* updateToken(newToken): Uppdaterar token i både localStorage och React state. Om ingen token anges, tas den bort från localStorage.
  function updateToken(newToken) {
    if (newToken) {
      localStorage.setItem("@inventory/token", newToken);
    } else {
      localStorage.removeItem("@inventory/token");
    }
    setTokenState(newToken); 
  }

  //* logout(): Tar bort token från localStorage och sätter token till null, vilket loggar ut användaren.
  function logout() {
    localStorage.removeItem("@inventory/token");
    setTokenState(null); 
  }

  //* Denna provider skickar vidare token, user, setToken och logout så att alla barnkomponenter kan få tillgång till dem via useAuth().
  return (
    <AuthContext.Provider
      value={{
        token,
        user: null,
        setToken: updateToken, 
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

//* Detta är en hjälpfunktion för att enkelt komma åt autentiseringskontexten i andra komponenter.
function useAuth() {
  return useContext(AuthContext);
}

export { AuthProvider, useAuth };
