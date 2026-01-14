import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/editarPerfil.css";
import { useNotification } from "../context/NotificationContext";

const EditarPerfil = () => {
  const { token, user, setUser } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    imatge: null,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); 

  // Refs per focus automàtic si hi ha error
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  // Carregar dades de l'usuari loguejat
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:8085/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserData({
          ...res.data.data,
          password: "",
          imatge: null,
        });
      } catch (err) {
        console.error(err);
        showNotification("No s'han pogut carregar les dades de l'usuari", "error");
      }
    };

    fetchUser();
  }, [token, showNotification]);

  // Canvis a camps
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imatge") {
      setUserData({ ...userData, imatge: files[0] });
    } else {
      setUserData({ ...userData, [name]: value });
    }
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("email", userData.email);
      if (userData.password) formData.append("password", userData.password);
      if (userData.imatge) formData.append("imatge", userData.imatge);

      const res = await axios.put(
        "http://localhost:8085/api/user/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser(res.data.data);
      localStorage.setItem("auth_user", JSON.stringify(res.data.data));
      setUserData({ ...userData, password: "", imatge: null });

      showNotification(res.data.message || "Perfil actualitzat correctament", "success");

      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      console.error(err);

      if (err.response?.status === 422 && err.response.data?.errors) {
        // Errors per camp
        const fieldErrors = {};
        for (const field in err.response.data.errors) {
          fieldErrors[field] = err.response.data.errors[field].join(". ");
        }
        setErrors(fieldErrors);

        // Focus automàtic al primer camp amb error
        if (fieldErrors.name) nameRef.current?.focus();
        else if (fieldErrors.email) emailRef.current?.focus();
        else if (fieldErrors.password) passwordRef.current?.focus();
      } else {
        showNotification(
          err.response?.data?.message || "Hi ha hagut un error, torna-ho a provar",
          "error"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="editar-perfil-page">
      <h2>Editar Perfil</h2>

      <form className="editar-perfil-form" onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Nom */}
        <label htmlFor="name">Nom</label>
        <input
          id="name"
          ref={nameRef}
          type="text"
          name="name"
          value={userData.name}
          onChange={handleChange}
          aria-required="true"
          aria-invalid={errors.name ? "true" : "false"}
          aria-describedby={errors.name ? "name-error" : undefined}
          required
        />
        {errors.name && <p id="name-error" className="error">{errors.name}</p>}

        {/* Email */}
        <label htmlFor="email">Email</label>
        <input
          id="email"
          ref={emailRef}
          type="email"
          name="email"
          value={userData.email}
          onChange={handleChange}
          aria-required="true"
          aria-invalid={errors.email ? "true" : "false"}
          aria-describedby={errors.email ? "email-error" : undefined}
          required
        />
        {errors.email && <p id="email-error" className="error">{errors.email}</p>}

        {/* Password */}
        <label htmlFor="password">Contrasenya (deixar buit si no vols canviar)</label>
        <input
          id="password"
          ref={passwordRef}
          type="password"
          name="password"
          value={userData.password}
          placeholder="••••••••"
          onChange={handleChange}
          aria-invalid={errors.password ? "true" : "false"}
          aria-describedby={errors.password ? "password-error" : undefined}
        />
        {errors.password && <p id="password-error" className="error">{errors.password}</p>}

        {/* Imatge */}
        <label htmlFor="imatge">Imatge de perfil</label>
        <input
          id="imatge"
          type="file"
          name="imatge"
          accept="image/*"
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Actualitzant..." : "Guardar canvis"}
        </button>
      </form>
    </div>
  );
};

export default EditarPerfil;
