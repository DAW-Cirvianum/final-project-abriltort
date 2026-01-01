import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h2>Benvingut, {user?.name}!</h2>
    </div>
  );
}