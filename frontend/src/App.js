import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

import { AuthProvider, useAuth } from './AuthContext';
import Layout       from './components/Layout';
import Login        from './pages/Login';
import Register     from './pages/Register';
import Dashboard    from './pages/Dashboard';
import Assessment   from './pages/Assessment';
import ResumeUpload from './pages/ResumeUpload';
import Career       from './pages/Career';
import Roadmap      from './pages/Roadmap';
import Placement    from './pages/Placement';
import Chatbot      from './pages/Chatbot';
import Progress     from './pages/Progress';
import Profile      from './pages/Profile';
import Admin        from './pages/Admin';
// ❌ AdminLogin REMOVED — not needed, insecure

function PrivateRoute({ children }) {
  const { isAuth } = useAuth();
  return isAuth ? children : <Navigate to="/login" />;
}

function AdminRoute() {
  const { isAuth, user } = useAuth();
  // Not logged in → go to login
  if (!isAuth) return <Navigate to="/login" />;
  // Logged in but not admin → go to dashboard
  if (!user || user.role !== 'admin') return <Navigate to="/" />;
  // Admin → show admin panel
  return <Admin />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* ❌ /admin-login route REMOVED */}

          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index             element={<Dashboard />} />
            <Route path="assessment" element={<Assessment />} />
            <Route path="resume"     element={<ResumeUpload />} />
            <Route path="career"     element={<Career />} />
            <Route path="roadmap"    element={<Roadmap />} />
            <Route path="placement"  element={<Placement />} />
            <Route path="chatbot"    element={<Chatbot />} />
            <Route path="progress"   element={<Progress />} />
            <Route path="profile"    element={<Profile />} />
            <Route path="admin"      element={<AdminRoute />} />
          </Route>

          {/* Catch all unknown routes → redirect to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}


// import React from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './index.css';

// import { AuthProvider, useAuth } from './AuthContext';
// import Layout        from './components/Layout';
// import Login         from './pages/Login';
// import Register      from './pages/Register';
// import Dashboard     from './pages/Dashboard';
// import Assessment    from './pages/Assessment';
// import ResumeUpload  from './pages/ResumeUpload';
// import Career        from './pages/Career';
// import Roadmap       from './pages/Roadmap';
// import Placement     from './pages/Placement';
// import Chatbot       from './pages/Chatbot';
// import Progress      from './pages/Progress';
// import Profile       from './pages/Profile';
// import Admin         from './pages/Admin';
// import AdminLogin    from './pages/AdminLogin';

// function PrivateRoute({ children }) {
//   const { isAuth } = useAuth();
//   return isAuth ? children : <Navigate to="/login" />;
// }
// function AdminRoute() {
//   const { user } = useAuth();
//   if (!user || user.role !== 'admin') {
//     return <Navigate to="/" />;
//   }
//   return <Admin />;
// }
// export default function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <ToastContainer position="top-right" autoClose={3000} />
//         <Routes>
//           <Route path="/login"    element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/admin-login" element={<AdminLogin />} />
//           <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
//             <Route index              element={<Dashboard />} />
//             <Route path="assessment"  element={<Assessment />} />
//             <Route path="resume"      element={<ResumeUpload />} />
//             <Route path="career"      element={<Career />} />
//             <Route path="roadmap"     element={<Roadmap />} />
//             <Route path="placement"   element={<Placement />} />
//             <Route path="chatbot"     element={<Chatbot />} />
//             <Route path="progress"    element={<Progress />} />
//             <Route path="profile"     element={<Profile />} />
//             <Route path="admin"       element={<AdminRoute />} />
//           </Route>
//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }

