import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/http";
import { saveSession } from "../lib/auth";

function ResidentAuth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("signup");
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const path = mode === "signup" ? "/auth/signup" : "/auth/login";
      const payload =
        mode === "signup"
          ? form
          : {
              email: form.email,
              password: form.password,
            };

      const response = await api.post(path, payload);
      const token = response.data?.data?.token;
      const user = response.data?.data?.user;

      if (!token || !user) {
        throw new Error("Invalid authentication response.");
      }

      if (user.role !== "resident") {
        throw new Error("This portal is for residents only.");
      }

      saveSession(token, user);
      navigate("/");
    } catch (err) {
      if (err.code === "ERR_NETWORK") {
        setError("Cannot reach backend. Start backend with npm run dev on port 5000.");
      } else {
        setError(err.response?.data?.message || err.message || "Authentication failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card auth-card reveal">
      <div className="heading-row">
        <h2>{mode === "signup" ? "Resident Signup" : "Resident Login"}</h2>
        <p>Create account or sign in to file and track your complaint</p>
      </div>

      <div className="inline-actions">
        <button
          type="button"
          className={mode === "signup" ? "btn-primary" : "btn-muted"}
          onClick={() => setMode("signup")}
        >
          Signup
        </button>
        <button
          type="button"
          className={mode === "login" ? "btn-primary" : "btn-muted"}
          onClick={() => setMode("login")}
        >
          Login
        </button>
      </div>

      <form className="stack-form" onSubmit={onSubmit}>
        {mode === "signup" && (
          <label>
            Username
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={onChange}
              placeholder="Your name"
              required
            />
          </label>
        )}

        <label>
          Email
          <input
            type="text"
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="resident@example.com"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            placeholder="Enter password"
            required
          />
        </label>

        <button className="btn-primary" disabled={loading} type="submit">
          {loading ? "Please wait..." : mode === "signup" ? "Create Resident Account" : "Login"}
        </button>
      </form>

      {error && <p className="alert error">{error}</p>}
    </section>
  );
}

export default ResidentAuth;
