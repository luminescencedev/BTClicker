import { useState } from "react";
import { useRouter } from "next/router";
import Header from "../component/header.js";

export default function Register() {
  const [role, setRole] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [mail, setMail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3001/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role,
        first_name: firstName,
        last_name: lastName,
        age,
        mail,
        phone,
        city,
        password,
      }),
    });

    if (response.ok) {
      router.push("/login");// Redirection vers la page de connexion après inscription
    } else {
      console.error("Registration failed");
    }
  };

  return (
    <>
          <main id='login'>
            <Header/>
            <div className="w-screen h-screen pt-[8vh] flex justify-center items-center">
              <div className="register-form w-screen h-full overflow-y-auto p-6 lg:w-[50%] items-center flex flex-col">
                <form onSubmit={handleRegister} className="flex flex-col gap-6 w-[60%] items-center">
                  <h1 className="text-2xl font-semibold mb-5">Nouveau sur Planity ?</h1>
                 <div className="flex flex-col gap-2 w-full">
                <label htmlFor="role" className="text-sm font-medium text-gray-700">Rôle *</label>
                <select
                  id="role"
                  className="border border-gray-300 bg-white rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                  value={role}
                  required
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="" disabled>Choisissez un rôle</option>
                  <option value="Coiffeur">Coiffeur</option>
                  <option value="Utilisateur">Utilisateur</option>
                </select>
              </div>
                  
                  <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="firstName" className="text-sm font-medium text-gray-700">Prénom *</label>
                    <input
                      id="firstName"
                      className="border border-gray-300 bg-white rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                      type="text"
                      placeholder="Prénom"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="lastName" className="text-sm font-medium text-gray-700">Nom *</label>
                    <input
                      id="lastName"
                      className="border border-gray-300 bg-white rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                      type="text"
                      placeholder="Nom"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="age" className="text-sm font-medium text-gray-700">Âge *</label>
                    <input
                      id="age"
                      className="border border-gray-300 bg-white rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                      type="number"
                      placeholder="Âge"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="mail" className="text-sm font-medium text-gray-700">Email *</label>
                    <input
                      id="mail"
                      className="border border-gray-300 bg-white rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                      type="email"
                      placeholder="Email"
                      value={mail}
                      onChange={(e) => setMail(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="phone" className="text-sm font-medium text-gray-700">Téléphone *</label>
                    <input
                      id="phone"
                      className="border border-gray-300 bg-white rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                      type="text"
                      placeholder="Téléphone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="city" className="text-sm font-medium text-gray-700">Ville *</label>
                    <input
                      id="city"
                      className="border border-gray-300 bg-white rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                      type="text"
                      placeholder="Ville"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">Mot de passe *</label>
                    <input
                      id="password"
                      className="border border-gray-300 bg-white rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                      type="password"
                      placeholder="Mot de passe"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-zinc-800 text-white py-3 rounded-md hover:bg-black transition duration-300"
                  >
                    S'inscrire
                  </button>
                </form>
                <div className="flex flex-col gap-6 w-[60%] items-center mt-5">
                  <div className="flex flex-row w-full items-center"><hr className="bg-black w-full "/> <p className="mx-4 text-sm">OU</p> <hr className="bg-black w-full"/></div>
                  <h1 className="text-2xl font-semibold my-">Vous avez déjà utilisé Planity ?</h1>
                  <button onClick={() => router.push("/login")} className="w-full bg-white text-black border-2 border-black py-3 rounded-md hover:bg-black hover:text-white transition duration-300">Se connecter</button>
                </div>
                
              </div>
              <div className="register-illustration w-[0] lg:w-[50%] h-full">
                <img src="/login.png" alt="Register Illustration" className="object-cover h-full w-full" />
              </div>
            </div>
          </main>
        </>
  );
}