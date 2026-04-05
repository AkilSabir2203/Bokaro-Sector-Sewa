import { Link, NavLink } from "react-router-dom";

function NavBar() {
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
      </nav>
    </header>
  );
}

export default NavBar;
