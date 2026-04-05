import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/http";
import { getUserProfile } from "../lib/auth";

function StatusPill({ status }) {
  return <span className={`pill ${status?.toLowerCase()}`}>{status || "Unknown"}</span>;
}

function TrackComplaint() {
  const user = getUserProfile();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [complaints, setComplaints] = useState([]);

  const fetchStatus = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/complaints/my-status");
      setComplaints(response.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to fetch complaint status.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "resident") {
      fetchStatus();
    }
  }, []);

  return (
    <section className="card reveal">
      <div className="heading-row">
        <h2>My Complaint Status</h2>
        <p>Resident-only complaint history and progress</p>
      </div>

      {user?.role !== "resident" && (
        <p className="alert error">
          Login as resident to view your status. <Link to="/resident/auth">Go to Resident Auth</Link>
        </p>
      )}

      {user?.role === "resident" && (
        <button className="btn-primary" type="button" onClick={fetchStatus} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh Status"}
        </button>
      )}

      {error && <p className="alert error">{error}</p>}

      {complaints.map((complaint) => (
        <article className="ticket" key={complaint._id}>
          <div>
            <h3>{complaint.complaintId}</h3>
            <StatusPill status={complaint.status} />
          </div>
          <p>
            <strong>Quarter:</strong> {complaint.quarterNo}
          </p>
          <p>
            <strong>Sector:</strong> {complaint.sector}
          </p>
          <p>
            <strong>Category:</strong> {complaint.category}
          </p>
          <p>
            <strong>Priority:</strong> {complaint.priority}
          </p>
          <p>
            <strong>Description:</strong> {complaint.description}
          </p>
        </article>
      ))}

      {!loading && user?.role === "resident" && complaints.length === 0 && !error && (
        <p className="alert">No complaints found yet.</p>
      )}
    </section>
  );
}

export default TrackComplaint;
