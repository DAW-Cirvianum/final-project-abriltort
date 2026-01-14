import { useNavigate } from "react-router-dom";
import "../styles/backButton.css";

const BackButton = ({ to, label = "Tornar" }) => {
  const navigate = useNavigate();

  return (
    <button className="back-button" onClick={() => navigate(to)}>
      ← {label}
    </button>
  );
};

export default BackButton;