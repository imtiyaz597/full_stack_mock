import { Link } from "react-router-dom";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./mocksidebar.css"; // ✅ Import your custom CSS

const MockSidebar = () => {
  return (
    <div
      className="bg-light border-end p-3 sidebar position-fixed"
      style={{
        minWidth: "250px",
        maxWidth: "250px",
        height: "100vh",
        zIndex: 1050,
      }}
    >
      <h4 className="mb-4">Admin Panel</h4>
      <ul className="list-unstyled sidebar-links">
        <li className="mb-2">
          <Link to="/admin-dashboard" className="sidebar-link">
            Dashboard
          </Link>
        </li>
        <li className="mb-2">
          <Link to="/mock-tests" className="sidebar-link">
            Mock Tests
          </Link>
        </li>
        <li className="mb-2">
          <Link to="/profile" className="sidebar-link">
            Profile
          </Link>
        </li>
        <li className="mb-2">
          <Link to="/accounts" className="sidebar-link">
            Accounts
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default MockSidebar;
