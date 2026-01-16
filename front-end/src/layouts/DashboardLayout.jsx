import { Outlet } from "react-router-dom";

/**
 * Layout per a la secció de Dashboard, s'encarrega de renderitzar la estructura i els components fills a través de <Outlet />.
 */
const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <main>
        {/* Outlet: renderitza la ruta fill actual del Dashboard */}
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;

