import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

/**
 * Context d'autenticació
 * Proporciona usuari, token i funcions per login, registre i logout
 */
export const AuthContext = createContext();

/**
 * Proveïdor d'autenticació
 *
 * @param {Object} props
 * @param {JSX.Element} props.children Components fills que utilitzaran el context
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);      // Usuari loguejat
  const [token, setToken] = useState(null);    // Token JWT
  const [loading, setLoading] = useState(true); 

  const TOKEN_KEY = "auth_token";
  const USER_KEY = "auth_user";

  // Configuració global de headers per axios
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  /**
   * Login amb email o nom d'usuari
   *
   * @param {string} loginInput Email o nom d'usuari
   * @param {string} password Contrasenya
   * @returns {Promise<{success: boolean, message?: string}>} Resultat del login
   */
  const login = async (loginInput, password) => {
    try {
      const res = await axios.post("http://localhost:8085/api/login", { 
        login: loginInput, 
        password 
      });

      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem(TOKEN_KEY, res.data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));

      return { success: true };
    } catch (err) {
      console.error(err);
      let message = "Error desconegut";
      if (err.response) message = err.response.data?.message || JSON.stringify(err.response.data);
      else if (err.request) message = "No s'ha pogut connectar amb el servidor";
      else message = err.message;

      return { success: false, message };
    }
  };

  /**
   * Registre d'un nou usuari
   *
   * @param {FormData} formData Dades del formulari de registre
   * @returns {Promise<{success: boolean, message?: string}>} Resultat del registre
   */
  const register = async (formData) => {
    try {
      const res = await axios.post(
        "http://localhost:8085/api/register",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem(TOKEN_KEY, res.data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));

      return { success: true };
    } catch (err) {
      let message = "Error desconegut";
      if (err.response) message = JSON.stringify(err.response.data);
      return { success: false, message };
    }
  };

  /**
   * Logout de l'usuari
   * Neteja estat i localStorage
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  // Carrega token i usuari desat a localStorage al iniciar l'app
  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    const savedUser = localStorage.getItem(USER_KEY);

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook personalitzat per utilitzar el context d'autenticació
 *
 * @returns {Object} { user, setUser, token, login, register, logout, loading }
 */
export const useAuth = () => useContext(AuthContext);
