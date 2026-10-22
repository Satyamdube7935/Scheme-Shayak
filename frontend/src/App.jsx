import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Protected from "./components/Protected.jsx";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./pages/Profile.jsx";
import Documents from "./pages/Documents.jsx";
import Schemes from "./pages/Schemes.jsx";
import SchemeDetail from "./pages/SchemeDetail.jsx";
import Recommendations from "./pages/Recommendations.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/schemes" element={<Schemes />} />
        <Route path="/schemes/:id" element={<SchemeDetail />} />
        <Route element={<Protected />}>
          <Route path="/app" element={<Dashboard />} />
          <Route path="/app/profile" element={<Profile />} />
          <Route path="/app/documents" element={<Documents />} />
          <Route path="/app/results" element={<Recommendations />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
