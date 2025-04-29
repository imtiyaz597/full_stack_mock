// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import * as XLSX from "xlsx";
// import { useNavigate } from "react-router-dom";
// import ".//ProfilePage.css"

// const ProfilePage = () => {
//   const [user, setUser] = useState(null); // For profile details
//   const [users, setUsers] = useState([]); // For admin's user list
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showDropdown, setShowDropdown] = useState(false); // Toggle dropdown
//   const [showManageUsers, setShowManageUsers] = useState(false); // Manage Users toggle
//   const [newUser, setNewUser] = useState({ name: "", email: "", role: "user" }); // For adding users
//   const navigate = useNavigate();


//   useEffect(() => {
//     const fetchProfileAndUsers = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           setError("User is not authenticated.");
//           setLoading(false);
//           return;
//         }

//         // Fetch profile
//         const profileResponse = await axios.get("http://localhost:5000/api/auth/profile", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setUser(profileResponse.data);

//         // Fetch admin data if the role is admin
//         if (profileResponse.data.role === "admin") {
//           const usersResponse = await axios.get("http://localhost:5000/api/admin/users", {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });
//           setUsers(usersResponse.data);
//         }
//       } catch (err) {
//         setError(err.response?.data?.message || "Something went wrong.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfileAndUsers();
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     window.location.reload();
//   };

//   const handleAddUser = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.post(
//         "http://localhost:5000/api/admin/users",
//         newUser,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setUsers([...users, response.data]);
//       setNewUser({ name: "", email: "", role: "user" });
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to add user.");
//     }
//   };

//   const handleDeleteUser = async (id) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setUsers(users.filter((user) => user._id !== id));
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to delete user.");
//     }
//   };

//   const handleExportToExcel = () => {
//     const worksheet = XLSX.utils.json_to_sheet(users.map(({ name, email }) => ({ name, email }))); // Only export name and email
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
//     XLSX.writeFile(workbook, "Registered_Users.xlsx");
//   };
  

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div style={{ color: "red" }}>{error}</div>;

//   // Get the initial of the user's name
//   const initial = user.name.charAt(0).toUpperCase();

//   return (
//     <div
//       className="profile-container"
//       style={{
//         fontFamily: "Arial, sans-serif",
//         padding: "20px",
//         maxWidth: "1200px",
//         margin: "0 auto",
//         position: "relative",
//       }}
//     >
//       {/* User Badge in Top-Right Corner */}
//       <div
//         style={{
//           position: "absolute",
//           top: "10px",
//           right: "10px",
//           display: "flex",
//           alignItems: "center",
//           cursor: "pointer",
//           zIndex: 1000,
//         }}
//         onClick={() => setShowDropdown(!showDropdown)}
//       >
//         <div
//           style={{
//             width: "50px",
//             height: "50px",
//             borderRadius: "50%",
//             backgroundColor: user.role === "admin" ? "#4CAF50" : "#2196F3",
//             color: "white",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             fontSize: "24px",
//             fontWeight: "bold",
//             boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//           }}
//         >
//           {initial}
//         </div>
//         {showDropdown && (
//           <div
//             style={{
//               position: "absolute",
//               top: "60px",
//               right: "0",
//               background: "white",
//               border: "1px solid #ddd",
//               borderRadius: "8px",
//               boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//               width: "200px",
//             }}
//           >
//             <ul style={{ listStyle: "none", padding: "10px", margin: 0 }}>
//               <li
//                 style={{
//                   padding: "10px",
//                   borderBottom: "1px solid #ddd",
//                   cursor: "pointer",
//                 }}
//                 onClick={handleLogout}
//               >
//                 Logout
//               </li>
//               {user.role === "admin" && (
//                 <li
//                   style={{
//                     padding: "10px",
//                     cursor: "pointer",
//                   }}
//                   onClick={() => {
//                     setShowManageUsers(!showManageUsers);
//                     setShowDropdown(false);
//                   }}
//                 >
//                   Manage Users
//                 </li>
//               )}
//             </ul>
//           </div>
//         )}
//       </div>

//       {/* Profile Section */}
//       <div style={{ textAlign: "center", marginTop: "80px" }}>
//         <h2>{user.name}</h2>
//         <p>Role: <strong>{user.role}</strong></p>
//       </div>

//       {/* Manage Users Section */}
//       {user.role === "admin" && showManageUsers && (
//         <div
//           style={{
//             marginTop: "20px",
//             background: "#e8f5e9",
//             padding: "20px",
//             borderRadius: "8px",
//           }}
//         >
//           <h3>Manage Users</h3>
//           {/* Add User Form */}
//           <div style={{ marginBottom: "20px" }}>
//             <h4>Add User</h4>
//             <input
//               type="text"
//               placeholder="Name"
//               value={newUser.name}
//               onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
//               style={{ marginRight: "10px", padding: "5px" }}
//             />
//             <input
//               type="email"
//               placeholder="Email"
//               value={newUser.email}
//               onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
//               style={{ marginRight: "10px", padding: "5px" }}
//             />
//             <button onClick={handleAddUser} style={{ padding: "5px 10px" }}>
//               Add User
//             </button>
//           </div>

//           {/* Users Table */}
//           <h4>Registered Users</h4>
//           <button
//             onClick={handleExportToExcel}
//             style={{
//               marginBottom: "20px",
//               padding: "10px 15px",
//               backgroundColor: "#4CAF50",
//               color: "white",
//               border: "none",
//               borderRadius: "5px",
//               cursor: "pointer",
//             }}
//           >
//             Export to Excel
//           </button>
//           <table style={{ width: "100%", borderCollapse: "collapse" }}>
//             <thead>
//               <tr style={{ backgroundColor: "#f5f5f5", textAlign: "left" }}>
//                 <th style={{ padding: "10px", border: "1px solid #ddd" }}>#</th>
//                 <th style={{ padding: "10px", border: "1px solid #ddd" }}>Name</th>
//                 <th style={{ padding: "10px", border: "1px solid #ddd" }}>Email</th>
//                 <th style={{ padding: "10px", border: "1px solid #ddd" }}>Role</th>
//                 <th style={{ padding: "10px", border: "1px solid #ddd" }}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.map((userItem, index) => (
//                 <tr key={userItem._id}>
//                   <td style={{ padding: "10px", border: "1px solid #ddd" }}>{index + 1}</td>
//                   <td style={{ padding: "10px", border: "1px solid #ddd" }}>{userItem.name}</td>
//                   <td style={{ padding: "10px", border: "1px solid #ddd" }}>{userItem.email}</td>
//                   <td style={{ padding: "10px", border: "1px solid #ddd" }}>{userItem.role}</td>
//                   <td style={{ padding: "10px", border: "1px solid #ddd" }}>
//                     <button
//                       onClick={() => handleDeleteUser(userItem._id)}
//                       style={{
//                         backgroundColor: "red",
//                         color: "white",
//                         border: "none",
//                         padding: "5px 10px",
//                         cursor: "pointer",
//                       }}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//     {/* 🔙 Back Button */}
// <button className="back-btn-fixed" onClick={() => navigate(-1)}>
//   ← Back
// </button>

//         </div>
//       )}

     

//     </div>
//   );
// };

// export default ProfilePage;





import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [social, setSocial] = useState({
    facebook: "",
    youtube: "",
    linkedin: "",
    telegram: "",
    whatsapp: "",
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://mock-full-stack-2.onrender.com/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;
        setUser(data);
        setPhone(data.phone || "");
        setDob(data.dob || "");
        setLocation(data.location || "");
        setDescription(data.description || "");
        setSocial(data.social || {});
        setPreviewPhoto(data.profilePhoto || "");
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("phone", phone);
      formData.append("dob", dob);
      formData.append("location", location);
      formData.append("description", description);
      formData.append("social", JSON.stringify(social));
      if (profilePhoto) formData.append("profilePhoto", profilePhoto);

      const res = await axios.put("https://mock-full-stack-2.onrender.com/api/auth/update-profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setUser(res.data);
      alert("Profile updated successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setProfilePhoto(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  if (!user) return <div>Loading...</div>;

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  };

  const labelStyle = {
    fontWeight: "bold",
    marginBottom: "5px",
    display: "block",
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto", fontFamily: "Arial" }}>
      <h2 style={{ textAlign: "center", color: "#333" }}>Welcome, {user.name}</h2>
      <p style={{ textAlign: "center", marginBottom: "30px" }}>
        Role: <strong>{user.role}</strong>
      </p>

      {/* Profile Photo Upload */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        {previewPhoto && (
          <img
            src={previewPhoto}
            alt="Profile"
            style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover", marginBottom: "10px" }}
          />
        )}
        <input type="file" onChange={handlePhotoChange} />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={labelStyle}>Phone Number</label>
        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} />

        <label style={labelStyle}>Date of Birth</label>
        <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} style={inputStyle} />

        <label style={labelStyle}>Location</label>
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} style={inputStyle} />

        <label style={labelStyle}>Description</label>
        <textarea
          rows="3"
          placeholder="Tell us a little about yourself..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3 style={{ marginBottom: "10px", color: "#444" }}>Social Media Links</h3>

        <label style={labelStyle}>Facebook: www.facebook.com/</label>
        <input
          type="text"
          value={social.facebook || ""}
          onChange={(e) => setSocial({ ...social, facebook: e.target.value })}
          placeholder="Username"
          style={inputStyle}
        />

        <label style={labelStyle}>YouTube: www.youtube.com/</label>
        <input
          type="text"
          value={social.youtube || ""}
          onChange={(e) => setSocial({ ...social, youtube: e.target.value })}
          placeholder="Channel name"
          style={inputStyle}
        />

        <label style={labelStyle}>LinkedIn: www.linkedin.com/</label>
        <input
          type="text"
          value={social.linkedin || ""}
          onChange={(e) => setSocial({ ...social, linkedin: e.target.value })}
          placeholder="Profile name"
          style={inputStyle}
        />

        <label style={labelStyle}>Telegram: www.telegram.com/</label>
        <input
          type="text"
          value={social.telegram || ""}
          onChange={(e) => setSocial({ ...social, telegram: e.target.value })}
          placeholder="Username"
          style={inputStyle}
        />

        <label style={labelStyle}>WhatsApp: wa.me/</label>
        <input
          type="text"
          value={social.whatsapp || ""}
          onChange={(e) => setSocial({ ...social, whatsapp: e.target.value })}
          placeholder="Phone number with country code"
          style={inputStyle}
        />
      </div>

      <button
        onClick={handleSaveProfile}
        style={{
          width: "100%",
          padding: "12px",
          backgroundColor: "#28a745",
          color: "white",
          fontSize: "16px",
          fontWeight: "bold",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Save Profile
      </button>
    </div>
  );
};

export default ProfilePage;