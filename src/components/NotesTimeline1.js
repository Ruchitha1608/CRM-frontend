import React, { useState } from "react";

function NotesTimeline({ notes, onUpdate, onDelete }) {
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editText, setEditText] = useState("");

  const startEdit = (note) => {
    setEditingNoteId(note.id);
    setEditText(note.body);
  };

  const saveEdit = (noteId) => {
    onUpdate(noteId, editText);
    setEditingNoteId(null);
    setEditText("");
  };

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {notes.length === 0 && (
        <p style={{ textAlign: "center", color: "#888", marginTop: "20px" }}>No notes yet.</p>
      )}
      {notes.map((note) => (
        <li
          key={note.id}
          style={{
            marginBottom: "15px",
            padding: "15px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            backgroundColor: "#fff",
            position: "relative",
            transition: "transform 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          {editingNoteId === note.id ? (
            <>
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  marginBottom: "10px",
                  fontSize: "14px",
                }}
              />
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => saveEdit(note.id)}
                  style={{
                    padding: "6px 14px",
                    backgroundColor: "#4CAF50",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingNoteId(null)}
                  style={{
                    padding: "6px 14px",
                    backgroundColor: "#f39c12",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <p style={{ margin: "0 0 6px 0", fontSize: "16px", lineHeight: "1.4", color: "#333" }}>
                {note.body}
              </p>
              <small style={{ color: "#888", fontSize: "12px" }}>
                {new Date(note.createdAt).toLocaleString()}
              </small>
              <div style={{ marginTop: "8px", display: "flex", gap: "10px" }}>
                <button
                  onClick={() => startEdit(note)}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(note.id)}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#e74c3c",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

export default NotesTimeline;
