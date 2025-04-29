// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import ".//Accounts.css"

// const Account = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUsers = async () => {
//       const token = localStorage.getItem("token");
//       try {
//         const response = await fetch("http://localhost:5000/api/admin/users", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const data = await response.json();

//         if (response.ok) {
//           setUsers(data);
//         } else {
//           setError(data.message || "Failed to fetch users.");
//         }
//       } catch (err) {
//         setError("An error occurred while fetching users.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   return (
//     <div className="container mt-5">
//       <h2 className="mb-4">Newly Created Accounts</h2>

//       {loading && <p>Loading accounts...</p>}
//       {error && <div className="alert alert-danger">{error}</div>}

//       {!loading && !error && users.length === 0 && (
//         <p className="text-muted">No accounts created yet.</p>
//       )}

//       {!loading && !error && users.length > 0 && (
//         <table className="table table-bordered table-striped">
//           <thead className="table-dark">
//             <tr>
//               <th>#</th>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Password</th>
//               <th>Role</th>
//               <th>Created At</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((user, index) => (
//               <tr key={user._id || index}>
//                 <td>{index + 1}</td>
//                 <td>{user.name}</td>
//                 <td>{user.email}</td>
//                 <td>{user.password || "N/A"}</td>
//                 <td>{user.role}</td>
//                 <td>{new Date(user.createdAt).toLocaleString()}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {/* Back Button */}
//       <button className="backbtn" onClick={() => navigate(-1)}>
//         ← Back
//       </button>
//     </div>
//   );
// };

// export default Account;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import * as XLSX from "xlsx";
import { FaTrashAlt } from "react-icons/fa"; // For delete icon
import "./Accounts.css";

const Account = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("name");
  const navigate = useNavigate();

  // 🟢 Fetch all users on load
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("https://mock-full-stack-2.onrender.com/api/admin/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setUsers(data);
          setFilteredUsers(data); // set filtered list
        } else {
          setError(data.message || "Failed to fetch users.");
        }
      } catch (err) {
        setError("An error occurred while fetching users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // 🧹 Delete user
  const handleDelete = async (userId) => {
    const token = localStorage.getItem("token");
    if (window.confirm("Are you sure you want to delete this account?")) {
      try {
        const response = await fetch(`https://mock-full-stack-2.onrender.com/api/admin/users/${userId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setUsers(users.filter((user) => user._id !== userId));
          setFilteredUsers(filteredUsers.filter((user) => user._id !== userId));
        } else {
          setError(data.message || "Failed to delete user.");
        }
      } catch (err) {
        setError("An error occurred while deleting the user.");
      }
    }
  };

  // 🔍 Handle filter/search
  useEffect(() => {
    if (!searchQuery) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user) =>
        user[filterType]?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, filterType, users]);

  // 📁 Download as Excel
  const handleDownload = () => {
    const exportData = users.map((user, index) => ({
      "S.No": index + 1,
      Name: user.name,
      Email: user.email,
      Password: user.password || "N/A",
      Role: user.role,
      "Created At": new Date(user.createdAt).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Accounts");
    XLSX.writeFile(workbook, "All_Accounts.xlsx");
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Newly Created Accounts</h2>

      {loading && <p>Loading accounts...</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && users.length === 0 && (
        <p className="text-muted">No accounts created yet.</p>
      )}

      {/* 🔎 Search and Filter */}
      <div className="mb-4 d-flex">
        <input
          type="text"
          className="form-control me-2"
          placeholder={`Search by ${filterType}`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="form-select"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="name">Name</option>
          <option value="email">Email</option>
        </select>
      </div>

      {/* ⬇ Download button */}
      {filteredUsers.length > 0 && (
        <button className="btn btn-success mb-3" onClick={handleDownload}>
          ⬇ Download Accounts
        </button>
      )}

      {/* 📋 User Table */}
      {!loading && !error && filteredUsers.length > 0 && (
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Password</th>
              <th>Role</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user._id || index}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.password || "N/A"}</td>
                <td>{user.role}</td>
                <td>{new Date(user.createdAt).toLocaleString()}</td>
                <td>
                  {user.role !== "admin" && (
                    <FaTrashAlt
                      style={{ cursor: "pointer", color: "red" }}
                      onClick={() => handleDelete(user._id)}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* 🔙 Back button */}
      <button className="backbtn" onClick={() => navigate(-1)}>
        ← Back
      </button>
    </div>
  );
};

export default Account;

