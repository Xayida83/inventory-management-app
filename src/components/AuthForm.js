"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";

function AuthForm() {
  const router = useRouter();
  const auth = useAuth();

  const [email, setEmail] = useState("test+vortals@testsson.com");
  const [password, setPassword] = useState("123123abc");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [successMessage, setSuccessMessage] = useState(""); // Nytt state för att hantera registrerad meddelande

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccessMessage(""); // Rensa tidigare meddelanden

    const url = isLogin ? "/api/auth/login" : "/api/auth/register";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        name,
      }),
    });

    if (response.ok) {
      const data = await response.json();

      if (isLogin) {
        // Vid inloggning, omdirigera till items
        localStorage.setItem("@inventory/token", data.token);
        auth.setToken(data.token);
        router.push("/items");
      } else {
        // Vid registrering, visa meddelande och inte bli omdirigerad
        setSuccessMessage("Account created successfully! You can now log in.");
      }
    } else {
      setError("Invalid login credentials");
    }
  }

  return (
    <div>
      <form
        className="w-full max-w-md mx-auto mt-8 p-5 border border-gray-300 rounded-md bg-white"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label className="block mb-1 font-bold">Email</label>
          <input
            className="w-full p-2 border border-gray-300 rounded text-base"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-bold">Password</label>
          <input
            className="w-full p-2 border border-gray-300 rounded text-base"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {!isLogin && (
          <div className="mb-4">
            <label className="block mb-1 font-bold">Name</label>
            <input
              className="w-full p-2 border border-gray-300 rounded text-base"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        {/* Visa felmeddelanden om inloggningen misslyckades */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Visa framgångsmeddelande om registreringen lyckades */}
        {successMessage && <p className="text-green-500">{successMessage}</p>}

        <button className="w-full p-2 text-base bg-blue-500 text-white rounded">
          {isLogin ? "Login" : "Register"}
        </button>

        <p className="text-center my-3">...or</p>
        <div className="form__group">
          <button
            className="w-full p-2 text-base bg-gray-500 text-white rounded"
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError(""); // Rensa eventuella felmeddelanden
              setSuccessMessage(""); // Rensa eventuella lyckade meddelanden
            }}
          >
            {!isLogin ? "Login" : "Register"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AuthForm;
