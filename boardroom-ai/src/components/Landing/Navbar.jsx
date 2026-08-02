import React from "react";
import "./Navbar.css";

export default function Navbar() {
  const items = [
    { label: "About", id: "about" },
    { label: "Features", id: "features" },
    { label: "AI Board Members", id: "ai-board-members" },
    { label: "How It Works", id: "how-it-works" },
    { label: "Privacy Policy", id: "privacy-policy" },
    { label: "Terms of Service", id: "terms-of-service" },
  ];

  return (
    <nav className="nav">
      <div className="logo">
        BoardRoom <span>AI</span>
      </div>

      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <a className="link" href={`/landing#${item.id}`}>{item.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}