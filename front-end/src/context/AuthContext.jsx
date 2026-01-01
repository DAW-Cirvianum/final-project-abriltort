import { useContext } from "react";
import { createContext, useState, useEffect } from "react";
import axios from "axios";

// Creem el context
export const AuthContext = createContext();

// Creem el provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);      // Usuari loguejat
  const [token, setToken] = useState(null);    // Token Bearer

  // Funció de login
const login = async (email, password) => {
  try {
    const res = await axios.post("http://localhost:8085/api/login", { email, password });
    setUser(res.data.user);
    setToken(res.data.token);
    localStorage.setItem("token", res.data.token);
    return { success: true };
  } catch (err) {
    console.error(err);

    let message = "Error desconegut";
    if (err.response) {
      // Laravel retorna JSON amb message
      message = err.response.data?.message || JSON.stringify(err.response.data);
    } else if (err.request) {
      message = "No s'ha pogut connectar amb el servidor";
    } else {
      message = err.message;
    }

    return { success: false, message };
  }
};

const register = async (formData) => {
    try {
      const res = await axios.post(
        "http://localhost:8085/api/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);

      return { success: true };
    } catch (err) {
      let message = "Error desconegut";
      if (err.response) {
        message = JSON.stringify(err.response.data);
      }
      return { success: false, message };
    }
  };

  // Funció de logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  // Comprovem si ja hi ha token guardat al carregar la app
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);