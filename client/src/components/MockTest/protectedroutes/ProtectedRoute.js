// import { useContext } from "react";
// import { Navigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";

// const ProtectedRoute = ({ children, allowedRoles }) => {
//     const { user } = useContext(AuthContext);


//     console.log("User role in ProtectedRoute:", user?.role);
//     // 🔹 Redirect to signin if not logged in
//     if (!user) {
//         return <Navigate to="/signin" />;
//     }

//     // 🔹 Redirect if user role is not allowed
//     if (allowedRoles && !allowedRoles.includes(user.role)) {
//         return <Navigate to="/signin" />;
//     }

//     return children;
// };

// export default ProtectedRoute;


// import { useContext } from "react";
// import { Navigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";

// const ProtectedRoute = ({ children, allowedRoles }) => {
//     const { user } = useContext(AuthContext);

//     console.log("User role in ProtectedRoute:", user?.role);

//     // 🔹 Redirect to signin if user is not authenticated
//     if (!user) {
//         console.log("User not authenticated. Redirecting to /signin.");
//         return <Navigate to="/signin" replace />;
//     }

//     // 🔹 Redirect to unauthorized page if user role is not allowed
//     if (allowedRoles && !allowedRoles.includes(user.role)) {
//         console.log(`User role "${user.role}" not authorized. Redirecting to /unauthorized.`);
//         return <Navigate to="/unauthorized" replace />;
//     }

//     // 🔹 Allow access to protected content
//     return children;
// };

// export default ProtectedRoute;



// import { useContext } from "react";
// import { Navigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";

// const ProtectedRoute = ({ children, allowedRoles }) => {
//     const { user } = useContext(AuthContext);

//     console.log("User role in ProtectedRoute:", user?.role);

//     // If user is not authenticated, redirect to sign-in page
//     if (!user) {
//         console.log("User not authenticated. Redirecting to /signin.");
//         return <Navigate to="/signin" replace />;
//     }

//     // If user role is not allowed, redirect to unauthorized page
//     if (allowedRoles && !allowedRoles.includes(user.role)) {
//         console.log(`User role "${user.role}" not authorized. Redirecting to /unauthorized.`);
//         return <Navigate to="/unauthorized" replace />;
//     }

//     // If authenticated and authorized, render the children
//     return children;
// };

// export default ProtectedRoute;



import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useContext(AuthContext);

    console.log("User in ProtectedRoute:", user);
    console.log("Allowed Roles in ProtectedRoute:", allowedRoles);
    console.log("User role being checked:", user ? user.role : "No role");

    if (!user || !user.role) {
        console.log("User not authenticated or role missing. Redirecting to /signin.");
        return <Navigate to="/signin" replace />;
    }

    // Normalize both user role and allowed roles
    const userRole = user.role.toLowerCase();
    const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase());

    if (!normalizedAllowedRoles.includes(userRole)) {
        console.warn(`❌ User role "${userRole}" not authorized. Redirecting to /unauthorized.`);
        return <Navigate to="/unauthorized" />;
    }

    return children;
};

export default ProtectedRoute;


