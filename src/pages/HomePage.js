import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", textAlign: "center", marginTop: "100px" }}>
      <h1 style={{ fontSize: "36px", marginBottom: "20px" }}>Welcome to CRM Lite</h1>
      <p style={{ fontSize: "18px", marginBottom: "40px" }}>Manage your leads efficiently and effectively.</p>
      <p style={{ fontSize: "18px", marginBottom: "40px" }}> Backend will take ~1 minute to start using the free service of Render.</p>
      <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
        <Link to="/login" style={{ padding: "10px 20px", backgroundColor: "#4CAF50", color: "white", textDecoration: "none", borderRadius: "6px" }}>Login</Link>
        <Link to="/register" style={{ padding: "10px 20px", backgroundColor: "#007bff", color: "white", textDecoration: "none", borderRadius: "6px" }}>Register</Link>
        <Link to="/leads" style={{ padding: "10px 20px", backgroundColor: "#f39c12", color: "white", textDecoration: "none", borderRadius: "6px" }}>View Leads</Link>
      </div>
    </div>
  );
}

export default HomePage;
