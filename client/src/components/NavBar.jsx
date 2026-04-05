import { Link, NavLink, useNavigate } from "react-router-dom";
import { clearSession, getUserProfile } from "../lib/auth";

function NavBar() {
  const navigate = useNavigate();
  const user = getUserProfile();

  const handleLogout = () => {
    clearSession();
    navigate("/resident/auth");
  };

  return (
    <header className="nav-shell">
      <Link to="/" className="brand">
        <span className="brand-mark">BS</span>
        <div>
          <h1>Bokaro Sector-Sewak</h1>
          <p>Township Maintenance and Complaint System</p>
        </div>
      </Link>

      <nav>
        <NavLink to="/" end>
          Register Complaint
        </NavLink>
        <NavLink to="/track">My Status</NavLink>
        <NavLink to="/resident/auth">Resident Auth</NavLink>
        <NavLink to="/admin/login">Admin</NavLink>

        {user && (
          <button type="button" className="btn-muted nav-logout" onClick={handleLogout}>
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}

export default NavBar;
