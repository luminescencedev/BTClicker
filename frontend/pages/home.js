import { useState } from "react";
import { useRouter } from "next/router";
import Terminal from "../component/Terminal";
import Clicker from "../component/clicker";


// Composant de recherche de services beauté
export default function Register() {
  
  const router = useRouter();
  
  return (
    <> 
      <main className="homePage h-screen w-screen">
        <div className="h-[50%] w-full p-1">
          <Terminal/>
        </div>
        <div className="h-[50%] w-full">
          <Clicker/>
        </div>
      </main>
    </>
    );
  }
