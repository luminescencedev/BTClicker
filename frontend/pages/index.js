import { useEffect, useContext } from "react";
import { useRouter } from "next/router";
import AuthContext from "../context/AuthContext";

export default function Home() {
  const { token } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    router.push("/home");
  }, [token]);

  return <p>Redirection en cours...</p>;
}
