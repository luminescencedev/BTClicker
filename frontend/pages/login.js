import { useState, useContext } from "react";
import { useRouter } from "next/router";
import AuthContext from "../context/AuthContext";
import Header from "../component/header.js";

export default function Login() {
  const { login } = useContext(AuthContext);// Récupération du contexte d'authentification
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();// Empêche le rechargement de la page
    const response = await fetch("http://localhost:3001/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mail, password }),
    });

    if (response.ok) {
      const data = await response.json();
      login(data.token);
      router.push("/home");// Redirection après connexion
    } else {
      // Handle login error
      console.error("Login failed");
    }
  };

  return (
    <>
      <main id='login'>
        <Header/>
        <div className="w-screen h-screen pt-[8vh] flex justify-center items-center">
          <div className="login-form w-screen lg:w-[50%] items-center flex flex-col">
            <form onSubmit={handleLogin} className="flex flex-col gap-6 w-[60%] items-center">
              <h1 className="text-2xl font-semibold mb-5">Vous avez déjà utilisé Planity ?</h1>
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="mail" className="text-sm font-medium text-gray-700">Email *</label>
                <input
                  id="mail"
                  className="border border-gray-300 bg-white rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                  type="email"
                  placeholder="Entrez votre email"
                  value={mail}
                  onChange={(e) => setMail(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">Mot de passe *</label>
                <input
                  id="password"
                  className="border border-gray-300 bg-white rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                  type="password"
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex justify-start w-full">
                <a href="#" className="text-sm hover:underline">Mot de passe oublié ?</a>
              </div>
              <button
                type="submit"
                className="w-full bg-zinc-800 text-white py-3 rounded-md hover:bg-black transition duration-300"
              >
                Se connecter
              </button>
            </form>
            <div className="flex flex-col gap-6 w-[60%] items-center mt-5">
              <div className="flex flex-row w-full items-center"><hr className="bg-black w-full "/> <p className="mx-4 text-sm">OU</p> <hr className="bg-black w-full"/></div>
              <h1 className="text-2xl font-semibold my-">Nouveau sur Planity ?</h1>
              <button onClick={() => router.push("/register")} className="w-full bg-white text-black border-2 border-black py-3 rounded-md hover:bg-black hover:text-white transition duration-300">Créer un compte</button>
            </div>
          </div>
          <div className="login-illustration w-[0] lg:w-[50%] h-full">
            <img src="/login.png" alt="Login Illustration" className="object-cover h-full w-full" />
          </div>
        </div>
      </main>
    </>
  );
}