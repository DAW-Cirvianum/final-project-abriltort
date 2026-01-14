import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

// Creem el context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);      
  const [token, setToken] = useState(null);    
  const [loading, setLoading] = useState(true); 

  const TOKEN_KEY = "auth_token";
  const USER_KEY = "auth_user";

  // Configuració global axios
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Login (email o nom d'usuari)
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

  // Register
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

  // Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  // Carreguem token i usuari al iniciar l'app
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

export const useAuth = () => useContext(AuthContext);
