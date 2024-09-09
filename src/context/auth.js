"use client";

import { createContext, useContext, useEffect, useState } from "react";

const defaultState = {
  user: null,
  token: null,
  setToken: () => {},
  logout: () => {}
};

const AuthContext = createContext(defaultState);

function AuthProvider({ children }) {
  const [token, setTokenState] = useState(defaultState.token);

  useEffect(() => {
    // Retrieve token from localStorage when component mounts
    const _token = localStorage.getItem("@library/token");
    console.log("Retrieved token from localStorage:", _token);
    if (_token) {
      setTokenState(_token); // Use setTokenState here
    }
  }, []);

  function updateToken(newToken) {
    if (newToken) {
      localStorage.setItem("@library/token", newToken);
    } else {
      localStorage.removeItem("@library/token");
    }
    setTokenState(newToken); // Use setTokenState here as well
  }

  function logout() {
    localStorage.removeItem("@library/token");
    setTokenState(null); // Use setTokenState here as well
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user: null,
        setToken: updateToken, // Use the renamed function here
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

export { AuthProvider, useAuth };
