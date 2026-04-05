import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import api from "../api/http";
import { clearSession, getToken, getUserProfile } from "../lib/auth";

const initialFilters = {
  status: "",
  priority: "",
  sector: "",
  search: "",
};

function AdminDashboard() {
  const navigate = useNavigate();
  const token = getToken();
  const admin = getUserProfile();

  const [filters, setFilters] = useState(initialFilters);
  const [complaints, setComplaints] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("limit", "50");

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    return params.toString();
  }, [filters]);

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const [summaryRes, complaintsRes] = await Promise.all([
        api.get("/admin/dashboard/summary"),
        api.get(`/complaints?${queryString}`),
      ]);

      setSummary(summaryRes.data?.data || null);
      setComplaints(complaintsRes.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard.");
      if (err.response?.status === 401) {
        clearSession();
        navigate("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [queryString]);

  const updateStatus = async (complaintId, status) => {
    try {
      await api.patch(`/admin/complaints/${complaintId}/status`, { status });
      fetchDashboard();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update complaint.");
    }
  };

  const logout = () => {
    clearSession();
    navigate("/admin/login");
  };

  if (!token || admin?.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <section className="card reveal">
      <div className="heading-row split">
        <div>
          <h2>Admin Dashboard</h2>
          <p>Welcome, {admin?.username || "Inspector"}</p>
        </div>
        <button className="btn-muted" onClick={logout} type="button">
          Logout
        </button>
      </div>

      {summary && (
        <div className="metrics">
          <article>
            <h4>Total</h4>
            <p>{summary.totals.total}</p>
          </article>
          <article>
            <h4>Pending</h4>
            <p>{summary.totals.pending}</p>
          </article>
          <article>
            <h4>Assigned</h4>
            <p>{summary.totals.assigned}</p>
          </article>
          <article>
            <h4>Resolved</h4>
            <p>{summary.totals.resolved}</p>
          </article>
          <article>
            <h4>High Priority</h4>
            <p>{summary.totals.highPriority}</p>
          </article>
        </div>
      )}

      <div className="filters">
        <input
          type="text"
          placeholder="Search complaint, quarter, description"
          value={filters.search}
          onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
        />

        <select
          value={filters.status}
          onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Assigned">Assigned</option>
          <option value="Resolved">Resolved</option>
          <option value="Rejected">Rejected</option>
        </select>

        <select
          value={filters.priority}
          onChange={(event) => setFilters((prev) => ({ ...prev, priority: event.target.value }))}
        >
          <option value="">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <input
          type="number"
          min="1"
          max="12"
          placeholder="Sector"
          value={filters.sector}
          onChange={(event) => setFilters((prev) => ({ ...prev, sector: event.target.value }))}
        />
      </div>

      {loading && <p className="alert">Loading dashboard...</p>}
      {error && <p className="alert error">{error}</p>}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Quarter</th>
              <th>Sector</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((item) => (
              <tr key={item._id}>
                <td>{item.complaintId}</td>
                <td>{item.quarterNo}</td>
                <td>{item.sector}</td>
                <td>{item.category}</td>
                <td>
                  <span className={`pill ${item.priority?.toLowerCase()}`}>{item.priority}</span>
                </td>
                <td>
                  <span className={`pill ${item.status?.toLowerCase()}`}>{item.status}</span>
                </td>
                <td>
                  <div className="row-actions">
                    <button type="button" onClick={() => updateStatus(item._id, "Assigned")}>
                      Assign
                    </button>
                    <button type="button" onClick={() => updateStatus(item._id, "Resolved")}>
                      Resolve
                    </button>
                    <button type="button" onClick={() => updateStatus(item._id, "Rejected")}>
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!complaints.length && (
              <tr>
                <td colSpan="7">No complaints found for this filter.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default AdminDashboard;
