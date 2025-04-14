import { AuthProvider } from "../context/AuthContext";
import "../styles/header.css";
import "../styles/footer.css";
import "../styles/account.css";

import "../styles/global.css";


function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;