import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/http";
import { saveSession } from "../lib/auth";

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", { email, password });
      const token = response.data?.data?.token;
      const user = response.data?.data?.user;

      if (!token || !user) {
        throw new Error("No token returned");
      }

      if (user.role !== "admin") {
        throw new Error("This login is restricted to admins.");
      }

      saveSession(token, user);
      navigate("/admin/dashboard");
    } catch (err) {
      if (err.code === "ERR_NETWORK") {
        setError("Cannot reach backend. Start backend with npm run dev on port 5000.");
      } else {
        setError(err.response?.data?.message || "Invalid login details.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card auth-card reveal">
      <div className="heading-row">
        <h2>Maintenance Inspector Login</h2>
        <p>Restricted access for complaint management</p>
      </div>

      <form className="stack-form" onSubmit={onSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="inspector@bokarosewa.in"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter password"
            required
          />
        </label>

        <button className="btn-primary" disabled={loading} type="submit">
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      {error && <p className="alert error">{error}</p>}
    </section>
  );
}

export default AdminLogin;
