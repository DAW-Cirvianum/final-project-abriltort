import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useNotification } from "../context/NotificationContext";
import "../styles/editarPerfil.css";

/**
 * Component per editar el perfil de l’usuari autenticat
 *
 * @returns {JSX.Element}
 */
const EditarPerfil = () => {
  const { token, user, setUser } = useAuth();

  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Estat del formulari
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    imatge: null,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  // Carregar dades de l'usuari loguejat
  useEffect(() => {
    /**
     * Obté les dades del perfil de l’usuari autenticat i omple el formulari
     */
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
        showNotification(
          t("editarPerfil.errors.loadProfile"),
          "error"
        );
      }
    };

    fetchUser();
  }, [token, showNotification, t]);

  /**
   * Gestiona els canvis als camps del formulari
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e
   */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imatge") {
      setUserData({ ...userData, imatge: files[0] });
    } else {
      setUserData({ ...userData, [name]: value });
    }
  };

  /**
   * Envia el formulari d’edició de perfil, actualitza les dades
   *
   * @param {React.FormEvent} e
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Preparació de les dades 
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("email", userData.email);
      if (userData.password) formData.append("password", userData.password);
      if (userData.imatge) formData.append("imatge", userData.imatge);

      // Petició d’actualització al backend
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

      // Actualització de l’usuari al context i localStorage
      setUser(res.data.data);
      localStorage.setItem("auth_user", JSON.stringify(res.data.data));
      setUserData({ ...userData, password: "", imatge: null });

      showNotification(
        res.data.message || t("editarPerfil.notifications.updateSuccess"),
        "success"
      );

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
          err.response?.data?.message || t("editarPerfil.errors.generic"),
          "error"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="editar-perfil-page">
      <h2>{t("editarPerfil.title")}</h2>

      <form className="editar-perfil-form" onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Nom */}
        <label htmlFor="name">{t("editarPerfil.fields.name")}</label>
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
        <label htmlFor="email">{t("editarPerfil.fields.email")}</label>
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
        <label htmlFor="password">{t("editarPerfil.fields.password")}</label>
        <input
          id="password"
          ref={passwordRef}
          type="password"
          name="password"
          value={userData.password}
          placeholder={t("editarPerfil.placeholders.password")}
          onChange={handleChange}
          aria-invalid={errors.password ? "true" : "false"}
          aria-describedby={errors.password ? "password-error" : undefined}
        />
        {errors.password && <p id="password-error" className="error">{errors.password}</p>}

        {/* Imatge */}
        <label htmlFor="imatge">{t("editarPerfil.fields.image")}</label>
        <input
          id="imatge"
          type="file"
          name="imatge"
          accept="image/*"
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading
            ? t("common.updating")
            : t("editarPerfil.buttons.saveChanges")}
        </button>
      </form>
    </div>
  );
};

export default EditarPerfil;
