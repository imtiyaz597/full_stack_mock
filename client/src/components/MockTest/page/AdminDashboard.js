  import { useContext } from "react";
  import { AuthContext } from "../context/AuthContext";
  import { useNavigate } from "react-router-dom";
  import "bootstrap/dist/css/bootstrap.min.css";
  import MockSidebar from "./MockSidebar";

  const AdminDashboard = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
      <div className="d-flex">
        {/* Sidebar */}
        <MockSidebar />

        {/* Main Content */}
        <div className="container mt-4">
          <div className="text-center">
            <h1 className="mb-3">Admin Dashboard</h1>
            <p className="text-muted">Monitor User Mock Test Performance</p>
          </div>

          {/* Buttons */}
          <div className="d-flex justify-content-center gap-3 mt-4">
          <button className="btn btn-success" onClick={() => navigate("/add-user")}>
            Add User
          </button>
            <button className="btn btn-danger" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  };

  export default AdminDashboard;
