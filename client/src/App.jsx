import { Navigate, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import ResidentHome from "./pages/ResidentHome";
import TrackComplaint from "./pages/TrackComplaint";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ResidentAuth from "./pages/ResidentAuth";

function App() {
  return (
    <div className="site-wrap">
      <div className="background-shape one" />
      <div className="background-shape two" />

      <main className="container">
        <NavBar />

        <Routes>
          <Route path="/" element={<ResidentHome />} />
          <Route path="/track" element={<TrackComplaint />} />
          <Route path="/resident/auth" element={<ResidentAuth />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
