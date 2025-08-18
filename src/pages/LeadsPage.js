import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/api.js";

// Import Google Font in your index.html or use @import in CSS:
// <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">

function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newLead, setNewLead] = useState({
    name: "",
    contact: "",
    company: "",
    status: "New",
    nextFollowUp: "",
    notes: [],
  });

  const [filter, setFilter] = useState({ name: "", company: "", status: "" });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [leads, filter]);

  const fetchLeads = async () => {
    try {
      const res = await axios.get("/leads", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeads(res.data.map((lead) => ({ ...lead, notes: lead.notes || [] })));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    const filtered = leads.filter((lead) => {
      return (
        lead.name.toLowerCase().includes(filter.name.toLowerCase()) &&
        lead.company.toLowerCase().includes(filter.company.toLowerCase()) &&
        (filter.status === "" || lead.status === filter.status)
      );
    });
    setFilteredLeads(filtered);
  };

  const handleCreateLead = async () => {
    try {
      const res = await axios.post("/leads", newLead, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeads([{ ...res.data, notes: [] }, ...leads]);
      setNewLead({ name: "", contact: "", company: "", status: "New", nextFollowUp: "", notes: [] });
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create lead");
    }
  };

  const handleUpdateLead = async (leadIndex, field, value) => {
    const leadToUpdate = { ...leads[leadIndex], [field]: value };
    try {
      const res = await axios.put(`/leads/${leadToUpdate.id}`, leadToUpdate, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedLeads = [...leads];
      updatedLeads[leadIndex] = { ...res.data, notes: leads[leadIndex].notes || [] };
      setLeads(updatedLeads);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update lead");
    }
  };

  const handleDeleteLead = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      await axios.delete(`/leads/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeads(leads.filter((lead) => lead.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete lead");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getFollowUpBadge = (dateStr) => {
    if (!dateStr) return null;
    const today = new Date();
    const followUpDate = new Date(dateStr);
    followUpDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (followUpDate.getTime() === today.getTime()) {
      return <span style={{ backgroundColor: "#4CAF50", color: "white", padding: "3px 8px", borderRadius: "6px", fontSize: "12px", fontWeight: 500 }}>Today</span>;
    } else if (followUpDate.getTime() < today.getTime()) {
      return <span style={{ backgroundColor: "#e74c3c", color: "white", padding: "3px 8px", borderRadius: "6px", fontSize: "12px", fontWeight: 500 }}>Overdue</span>;
    } else {
      return <span style={{ backgroundColor: "#f39c12", color: "white", padding: "3px 8px", borderRadius: "6px", fontSize: "12px", fontWeight: 500 }}>Upcoming</span>;
    }
  };

  if (loading) return <p style={{ textAlign: "center", fontFamily: "Inter, sans-serif", fontSize: "16px" }}>Loading leads...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center", fontFamily: "Inter, sans-serif", fontSize: "16px" }}>{error}</p>;

  return (
    <div style={{ maxWidth: "1200px", margin: "40px auto", fontFamily: "Inter, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: 600 }}>Leads Management</h2>
        <button
          onClick={handleLogout}
          style={{ padding: "10px 20px", backgroundColor: "#e74c3c", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: 500 }}
        >
          Logout
        </button>
      </div>

      {/* Create Lead */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "25px", padding: "20px", border: "1px solid #ddd", borderRadius: "10px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", backgroundColor: "#fafafa" }}>
        <input type="text" placeholder="Name" value={newLead.name} onChange={(e) => setNewLead({ ...newLead, name: e.target.value })} style={{ flex: "1 1 150px", padding: "12px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "14px" }} />
        <input type="text" placeholder="Contact" value={newLead.contact} onChange={(e) => setNewLead({ ...newLead, contact: e.target.value })} style={{ flex: "1 1 150px", padding: "12px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "14px" }} />
        <input type="text" placeholder="Company" value={newLead.company} onChange={(e) => setNewLead({ ...newLead, company: e.target.value })} style={{ flex: "1 1 150px", padding: "12px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "14px" }} />
        <select value={newLead.status} onChange={(e) => setNewLead({ ...newLead, status: e.target.value })} style={{ flex: "1 1 130px", padding: "12px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "14px" }}>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="In Progress">In Progress</option>
          <option value="Won">Won</option>
          <option value="Lost">Lost</option>
        </select>
        <input type="date" value={newLead.nextFollowUp} onChange={(e) => setNewLead({ ...newLead, nextFollowUp: e.target.value })} style={{ flex: "1 1 150px", padding: "12px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "14px" }} />
        <button onClick={handleCreateLead} style={{ padding: "12px 24px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: 500 }}>Add Lead</button>
      </div>

      {/* Filter Bar */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Filter by Name"
          value={filter.name}
          onChange={(e) => setFilter({ ...filter, name: e.target.value })}
          style={{ flex: "1 1 200px", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "14px" }}
        />
        <input
          type="text"
          placeholder="Filter by Company"
          value={filter.company}
          onChange={(e) => setFilter({ ...filter, company: e.target.value })}
          style={{ flex: "1 1 200px", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "14px" }}
        />
        <select
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          style={{ flex: "1 1 150px", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "14px" }}
        >
          <option value="">All Status</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="In Progress">In Progress</option>
          <option value="Won">Won</option>
          <option value="Lost">Lost</option>
        </select>
      </div>

      {/* Leads Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
          <thead>
            <tr style={{ backgroundColor: "#f4f4f4", fontWeight: 600 }}>
              <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>Name</th>
              <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>Contact</th>
              <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>Company</th>
              <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>Status</th>
              <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>Next Follow-Up</th>
              <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>Notes</th>
              <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead, index) => (
              <tr key={lead.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "10px" }}>
                  <Link to={`/leads/${lead.id}`} state={{ lead }} style={{ textDecoration: "none", color: "#007bff", fontWeight: 500 }}>
                    {lead.name}
                  </Link>
                </td>
                <td style={{ padding: "10px" }}>
                  <input type="text" value={lead.contact || ""} onChange={(e) => handleUpdateLead(index, "contact", e.target.value)} style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc", width: "100%", fontSize: "14px" }} />
                </td>
                <td style={{ padding: "10px" }}>
                  <input type="text" value={lead.company || ""} onChange={(e) => handleUpdateLead(index, "company", e.target.value)} style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc", width: "100%", fontSize: "14px" }} />
                </td>
                <td style={{ padding: "10px" }}>
                  <select value={lead.status} onChange={(e) => handleUpdateLead(index, "status", e.target.value)} style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc", width: "100%", fontSize: "14px" }}>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Won">Won</option>
                    <option value="Lost">Lost</option>
                  </select>
                </td>
                <td style={{ padding: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <input type="date" value={lead.nextFollowUp ? lead.nextFollowUp.split("T")[0] : ""} onChange={(e) => handleUpdateLead(index, "nextFollowUp", e.target.value)} style={{ padding: "6px", borderRadius: "6px", border: "1px solid #ccc", width: "100%", fontSize: "14px" }} />
                    {getFollowUpBadge(lead.nextFollowUp)}
                  </div>
                </td>
                <td style={{ padding: "10px" }}>
                  <button onClick={() => navigate(`/leads/${lead.id}`, { state: { lead } })} style={{ padding: "6px 12px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: 500 }}>View Notes</button>
                </td>
                <td style={{ padding: "10px" }}>
                  <button onClick={() => handleDeleteLead(lead.id)} style={{ padding: "6px 12px", backgroundColor: "#e74c3c", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: 500 }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LeadsPage;
