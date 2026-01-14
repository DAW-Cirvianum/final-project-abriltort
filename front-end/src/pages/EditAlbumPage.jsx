import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AlbumForm from "../components/AlbumForm";
import { useAuth } from "../context/AuthContext";

const EditAlbumPage = () => {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [album, setAlbum] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8085/api/albums/${albumId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setAlbum(res.data.data))
      .catch(() => {
        setError("No tens permisos per editar aquest àlbum");
      });
  }, [albumId, token]);

  if (error) return <p className="error">{error}</p>;
  if (!album) return <p>Carregant àlbum...</p>;

  return (
    <div className="page-wrapper">
      <h2>Editar àlbum</h2>

      <AlbumForm
        portfoliId={album.portfoli_id}
        initialData={album}
        onSuccess={() => navigate(-1)}
      />
    </div>
  );
};

export default EditAlbumPage;
