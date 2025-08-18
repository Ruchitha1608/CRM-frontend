import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "../api/api.js";

function LeadDetailPage() {
  const location = useLocation();
  const [lead, setLead] = useState(location.state?.lead || null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (lead) fetchNotes();
  }, [lead]);

  const fetchNotes = async () => {
    try {
      const res = await axios.get(`/leads/${lead.id}/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(res.data);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote) return;
    try {
      const res = await axios.post(
        `/leads/${lead.id}/notes`,
        { body: newNote },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotes([...notes, res.data]);
      setNewNote("");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add note");
    }
  };

  const handleUpdateNote = async (noteId, body) => {
    try {
      const res = await axios.put(
        `/leads/${lead.id}/notes/${noteId}`,
        { body },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotes(notes.map((n) => (n.id === noteId ? res.data : n)));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update note");
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await axios.delete(`/leads/${lead.id}/notes/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.filter((n) => n.id !== noteId));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete note");
    }
  };

  if (!lead) return <p style={{ textAlign: "center" }}>Lead data not available.</p>;
  if (loading) return <p style={{ textAlign: "center" }}>Loading notes...</p>;

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      
      {/* Lead Info Card */}
      <div
        style={{
          padding: "30px",
          marginBottom: "40px",
          borderRadius: "12px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
          backgroundColor: "#fff",
          transition: "transform 0.2s",
        }}
      >
        <h2 style={{ marginBottom: "15px", color: "#222" }}>{lead.name}</h2>
        <p><strong>Contact:</strong> {lead.contact}</p>
        <p><strong>Status:</strong> <span style={{ color: lead.status === "Lost" ? "#e74c3c" : "#4CAF50", fontWeight: "bold" }}>{lead.status}</span></p>
        <p><strong>Next Follow-Up:</strong> {lead.nextFollowUp ? new Date(lead.nextFollowUp).toLocaleDateString() : "-"}</p>
      </div>

      {/* Notes Section */}
      <h3 style={{ marginBottom: "20px", color: "#555" }}>Notes Timeline</h3>
      <div style={{ position: "relative", paddingLeft: "20px", marginBottom: "30px" }}>
        {/* Vertical timeline line */}
        <div style={{
          position: "absolute",
          left: "7px",
          top: "0",
          bottom: "0",
          width: "4px",
          backgroundColor: "#e0e0e0",
          borderRadius: "2px"
        }}></div>

        {notes.length === 0 && <p style={{ color: "#777", marginLeft: "20px" }}>No notes yet. Add one below!</p>}

        {notes.map((note, idx) => (
          <div key={note.id} style={{
            position: "relative",
            marginBottom: "25px",
            padding: "15px 20px",
            borderRadius: "8px",
            backgroundColor: "#fdfdfd",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            marginLeft: "20px",
          }}>
            {/* Timeline dot */}
            <div style={{
              position: "absolute",
              left: "-28px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "16px",
              height: "16px",
              backgroundColor: "#4CAF50",
              borderRadius: "50%",
              border: "3px solid #fff",
              boxShadow: "0 0 4px rgba(0,0,0,0.2)"
            }}></div>

            <p style={{ margin: "0 0 8px 0", fontSize: "15px", lineHeight: "1.5", color: "#333" }}>{note.body}</p>
            <small style={{ color: "#888", fontSize: "12px" }}>{new Date(note.createdAt).toLocaleString()}</small>

            <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
              <button
                onClick={() => {
                  const updatedBody = prompt("Edit note:", note.body);
                  if (updatedBody !== null) handleUpdateNote(note.id, updatedBody);
                }}
                style={{
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "6px 12px",
                  cursor: "pointer",
                  fontSize: "13px"
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteNote(note.id)}
                style={{
                  backgroundColor: "#e74c3c",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "6px 12px",
                  cursor: "pointer",
                  fontSize: "13px"
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Note Form */}
      <div style={{ display: "flex", gap: "12px", marginTop: "30px" }}>
        <input
          type="text"
          placeholder="Add a new note..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
        />
        <button
          onClick={handleAddNote}
          style={{
            padding: "12px 28px",
            backgroundColor: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "14px"
          }}
        >
          Add Note
        </button>
      </div>
    </div>
  );
}

export default LeadDetailPage;
