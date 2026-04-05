import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/http";
import { getUserProfile } from "../lib/auth";

const defaultForm = {
  quarterNo: "",
  sector: "",
  category: "Plumbing",
  priority: "Medium",
  description: "",
};

function ResidentHome() {
  const user = getUserProfile();
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ticket, setTicket] = useState("");

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setTicket("");

    try {
      const response = await api.post("/complaints", {
        ...form,
        sector: Number(form.sector),
      });

      setTicket(response.data?.data?.complaintId || "Generated");
      setForm(defaultForm);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to submit complaint right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card stack-up reveal">
      <div className="heading-row">
        <h2>Resident Complaint Desk</h2>
        <p>Sectors 1-12 | Plumbing, electrical, carpentry</p>
      </div>

      {user?.role !== "resident" && (
        <p className="alert error">
          Resident login required before filing complaint. <Link to="/resident/auth">Go to Resident Auth</Link>
        </p>
      )}

      <form className="grid-form" onSubmit={onSubmit}>
        <label>
          Quarter Number
          <input
            type="text"
            name="quarterNo"
            value={form.quarterNo}
            onChange={onChange}
            placeholder="QTR-4-C-105"
            required
          />
        </label>

        <label>
          Sector
          <input
            type="number"
            name="sector"
            value={form.sector}
            onChange={onChange}
            min="1"
            max="12"
            placeholder="4"
            required
          />
        </label>

        <label>
          Category
          <select name="category" value={form.category} onChange={onChange}>
            <option>Plumbing</option>
            <option>Electrical</option>
            <option>Carpentry</option>
          </select>
        </label>

        <label>
          Priority
          <select name="priority" value={form.priority} onChange={onChange}>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </label>

        <label className="wide">
          Problem Description
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            rows="4"
            placeholder="Explain the issue clearly..."
            required
          />
        </label>

        <button className="btn-primary wide" disabled={loading || user?.role !== "resident"} type="submit">
          {loading ? "Submitting..." : "Submit Complaint"}
        </button>
      </form>

      {error && <p className="alert error">{error}</p>}
      {ticket && (
        <p className="alert success">
          Complaint submitted. Your Complaint ID: <strong>{ticket}</strong>
        </p>
      )}
    </section>
  );
}

export default ResidentHome;
