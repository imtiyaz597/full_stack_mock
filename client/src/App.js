// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import AuthProvider from "./components/MockTest/context/AuthContext";
// import SignIn from "./components/MockTest/page/SignIn";
// import SignUp from "./components/MockTest/page/SignUp";
// import AdminDashboard from "./components/MockTest/page/AdminDashboard";
// import UserDashboard from "./components/MockTest/page/UserDashboard";
// import ProtectedRoute from "./components/MockTest/protectedroutes/ProtectedRoute";
// import MockTestPage from "./components/MockTest/page/MockTestPage";
// import CreateMockTest from "./components/MockTest/page/CreateMockTest";
// import MockExam from "./components/MockTest/page/Exam";
// import Exam from "./components/MockTest/page/Exam";
// import { AuthContext } from "./context/AuthContext";
// import UserProfile from "./components/MockTest/page/UserProfile";
// import AdminProfile from "./components/MockTest/page/AdminProfile";

// function App() {
//     return (
//         <Router>
//                 <AuthProvider>
//                 <Routes>
//                     <Route path="/signin" element={<SignIn />} />
//                     <Route path="/signup" element={<SignUp />} />
                    
//                     {/* 🔹 Protect Admin Route */}
//                     <Route 
//                         path="/admin-dashboard" 
//                         element={
//                             <ProtectedRoute allowedRoles={["admin"]}>
//                                 <AdminDashboard />
                                
//                             </ProtectedRoute>
//                         } 
//                     />

//                     <Route path="/mock-tests" element={<MockTestPage/>}/>
//                     <Route path="/create-mock-test" element={<CreateMockTest/>}/>
//                     <Route path="/exam/:id" element={<Exam />} />
//                     {/* <Route path="/exam/:id" element={<Exam mockTests={mockTestsData} />} /> */}
                    
//                     {/* 🔹 Protect User Route */}
//                     <Route 
//                         path="/user-dashboard" 
//                         element={
//                             <ProtectedRoute allowedRoles={["user"]}>
//                                 <UserDashboard />
//                             </ProtectedRoute>
//                         } 
//                     />
//                      <Route
//                 path="/profile"
//                 element={
//                     <ProtectedRoute>
//                         {/* Render based on role */}
//                         {user?.role === "admin" ? <AdminProfile /> : <UserProfile />}
//                     </ProtectedRoute>
//                 }
//             />

//                     {/* 🔹 Redirect to SignIn if unknown route */}
//                     <Route path="*" element={<SignIn />} />

                    
//                 </Routes>
//         </AuthProvider>
//             </Router>
//     );
// }

// export default App;


// import React, { useContext } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import AuthProvider, { AuthContext } from "./components/MockTest/context/AuthContext";
// import SignIn from "./components/MockTest/page/SignIn";
// import SignUp from "./components/MockTest/page/SignUp";
// import AdminDashboard from "./components/MockTest/page/AdminDashboard";
// import UserDashboard from "./components/MockTest/page/UserDashboard";
// import ProtectedRoute from "./components/MockTest/protectedroutes/ProtectedRoute";
// import MockTestPage from "./components/MockTest/page/MockTestPage";
// import CreateMockTest from "./components/MockTest/page/CreateMockTest";
// import Exam from "./components/MockTest/page/Exam";
// import UserProfile from "./components/MockTest/page/UserProfile";
// import AdminProfile from "./components/MockTest/page/AdminProfile";

// function App() {
//     return (
//         <Router>
//              <AuthProvider>
//                 <AppRoutes />
//             </AuthProvider>
//         </Router>
//     );
// }

// const AppRoutes = () => {
//     const { user } = useContext(AuthContext); // Access user context here after AuthProvider wraps the component

//     return (
//         <Routes>
//             {/* 🔹 Public Routes */}
//             <Route path="/signin" element={<SignIn />} />
//             <Route path="/signup" element={<SignUp />} />

//             {/* 🔹 Admin Protected Route */}
//             <Route
//                 path="/admin-dashboard"
//                 element={
//                     <ProtectedRoute allowedRoles={["admin"]}>
//                         <AdminDashboard />
//                     </ProtectedRoute>
//                 }
//             />

//             {/* 🔹 Public Mock Test Routes */}
//             <Route path="/mock-tests" element={<MockTestPage />} />
//             <Route path="/create-mock-test" element={<CreateMockTest />} />
//             <Route path="/exam/:id" element={<Exam />} />

//             {/* 🔹 User Protected Route */}
//             <Route
//                 path="/user-dashboard"
//                 element={
//                     <ProtectedRoute allowedRoles={["user"]}>
//                         <UserDashboard />
//                     </ProtectedRoute>
//                 }
//             />

//             {/* 🔹 Profile Route - Render Based on Role */}
//             <Route
//                 path="/profile"
//                 element={
//                     <ProtectedRoute>
//                         {user?.role === "admin" ? <AdminProfile /> : <UserProfile />}
//                     </ProtectedRoute>
//                 }
//             />

//             {/* 🔹 Redirect to SignIn for Unknown Routes */}
//             <Route path="*" element={<SignIn />} />
//         </Routes>
//     );
// };

// export default App;


// import React, { useContext } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import AuthProvider, { AuthContext } from "./components/MockTest/context/AuthContext";
// import SignIn from "./components/MockTest/page/SignIn";
// import SignUp from "./components/MockTest/page/SignUp";
// import AdminDashboard from "./components/MockTest/page/AdminDashboard";
// import UserDashboard from "./components/MockTest/page/UserDashboard";
// import ProtectedRoute from "./components/MockTest/protectedroutes/ProtectedRoute";
// import MockTestPage from "./components/MockTest/page/MockTestPage";
// import CreateMockTest from "./components/MockTest/page/CreateMockTest";
// import Exam from "./components/MockTest/page/Exam";
// import ProfilePage from "./components/MockTest/page/ProfilePage"; // New Profile Page Component
// import AdminPage from "./components/MockTest/page/AdminDashboard";
// import Management from "./components/MockTest/page/Management";

// function App() {
//     return (
//         <Router>
//             <AuthProvider>
//                 <AppRoutes />
//             </AuthProvider>
//         </Router>
//     );
// }

// const AppRoutes = () => {
//     const { user } = useContext(AuthContext); // Access user context here after AuthProvider wraps the component

//     return (
//         <Routes>
//             {/* 🔹 Public Routes */}
//             <Route path="/signin" element={<SignIn />} />
//             <Route path="/signup" element={<SignUp />} />

//             {/* 🔹 Admin Protected Route */}
//             <Route
//                 path="/admin-dashboard"
//                 element={
//                     <ProtectedRoute allowedRoles={["admin"]}>
//                         <AdminDashboard />
                        
//                     </ProtectedRoute>
//                 }
//             />
//               {/* User Management Route */}
//               <Route

//         path="/user-manage"
//         element={
//           <ProtectedRoute allowedRoles={["admin"]}>
//             <AdminPage />
//           </ProtectedRoute>
//         }
//       />
//        <Route path="/management" element={<Management />} />


//             {/* 🔹 Public Mock Test Routes */}
//             <Route path="/mock-tests" element={<MockTestPage />} />
//             <Route path="/create-mock-test" element={<CreateMockTest />} />
//             <Route
//   path="/exam/:testId"
//   element={
//     <ProtectedRoute allowedRoles={["user", "admin"]}>
//       <Exam />
//     </ProtectedRoute>
//   }
// />


//                     {/* <Route
//                         path="/exam/:id/edit"
//                         element={
//                             <ProtectedRoute allowedRoles={["admin"]}>
//                                 <EditMockTest />
//                             </ProtectedRoute>
//                         }
//                     /> */}

            


//             {/* 🔹 User Protected Route */}
//             <Route
//                 path="/user-dashboard"
//                 element={
//                     <ProtectedRoute allowedRoles={["user"]}>
//                         <UserDashboard />
//                     </ProtectedRoute>
//                 }
//             />

//             {/* 🔹 Profile Route - Render Based on Role */}
//             <Route
//                 path="/profile"
//                 element={
//                     <ProtectedRoute>
//                         <ProfilePage /> {/* Dynamically display the profile page with user badge */}
//                     </ProtectedRoute>
//                 }
//             />

//             {/* 🔹 Redirect to SignIn for Unknown Routes */}
//             <Route path="*" element={<SignIn />} />
//         </Routes>
//     );
// };

// export default App;








import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider, { AuthContext } from "./components/MockTest/context/AuthContext";
import SignIn from "./components/MockTest/page/SignIn";
import SignUp from "./components/MockTest/page/SignUp";
import AdminDashboard from "./components/MockTest/page/AdminDashboard";
import UserDashboard from "./components/MockTest/page/UserDashboard";
import ProtectedRoute from "./components/MockTest/protectedroutes/ProtectedRoute";
import MockTestPage from "./components/MockTest/page/MockTestPage";
import CreateMockTest from "./components/MockTest/page/CreateMockTest";
import Exam from "./components/MockTest/page/Exam";
import ProfilePage from "./components/MockTest/page/ProfilePage"; 

import Management from "./components/MockTest/page/Management";
import AddUserForm from "./components/MockTest/page/AddUserForm";
import TeacherDashboard from "./components/MockTest/page/TeacherDashboard";
import ManagementDashboard from "./components/MockTest/page/ManagementDashboard";
import StudentDashboard from "./components/MockTest/page/StudentDashboard";
import Account from "./components/MockTest/page/Accounts";
import ForgotPassword from "./components/MockTest/page/ForgotPassword";
import ResetPassword from "./components/MockTest/page/ResetPassword";
import UserPage from './components/MockTest/page/UserPage';
import SolutionPage from './components/MockTest/page/SolutionPage';
import ReportPage from './components/MockTest/page/ReportPage';




// Inside <Routes>...
<Route path="/solution/:resultId" element={<SolutionPage />} />


function App() {
    return (
        <Router>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </Router>
    );
}

const AppRoutes = () => {
    const { user } = useContext(AuthContext); // Access user context after AuthProvider wraps the component

    return (
        
        <Routes>
            {/* 🔹 Public Routes */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
        <Route path = "/add-user" element={<AddUserForm/>}/>

            {/* 🔹 Admin Protected Routes */}
            <Route
                path="/admin-dashboard"
                element={
                    <ProtectedRoute allowedRoles={["Admin"]}>
                        <AdminDashboard />
                    </ProtectedRoute>
                    
                }
                
            />      
            
            <Route path="/accounts" element={ <Account/>} />


           <Route
        path="/student-dashboard"
        element={
          <ProtectedRoute allowedRoles={["Student", "Admin"]}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher-dashboard"
        element={
          <ProtectedRoute allowedRoles={["Teacher", "Admin"]}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/management-dashboard"
        element={
          <ProtectedRoute allowedRoles={["Management", "Admin"]}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />

            {/* 🔹 Public Mock Test Routes */}
            <Route path="/mock-tests" element={<MockTestPage />} />
            <Route path="/create-mock-test" element={<CreateMockTest />} />
            <Route path="/userpage" element={<UserPage />} />
            


            {/* 🔹 Exam Route (Restricted to Students & Admins) */}
            <Route
                path="/exam/:testId"
                element={
                    <ProtectedRoute allowedRoles={["Student", "Admin", "Teacher", "Management"]}>
                        <Exam />
                    </ProtectedRoute>
                }
            />

            {/* 🔹 User Protected Route */}
            <Route
                path="/user-dashboard"
                element={
                    <ProtectedRoute allowedRoles={["Student"]}>
                        <UserDashboard />
                    </ProtectedRoute>
                }
            />

            {/* 🔹 Profile Route (Restricted to Logged-In Users) */}
            <Route
                path="/profile"
                element={
                    <ProtectedRoute allowedRoles={["Admin", "Teacher", "Student", "Management"]}>
                        <ProfilePage />
                    </ProtectedRoute>
                }
            />
            <Route path="/solution/:resultId" element={<SolutionPage />} />
            <Route path="/report/:resultId" element={<ReportPage />} />

<Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* 🔹 Redirect to SignIn for Unknown Routes */}
            <Route path="*" element={<SignIn />} />
        </Routes>
    );
};

export default App;
