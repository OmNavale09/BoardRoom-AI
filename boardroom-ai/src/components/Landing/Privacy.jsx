import React from "react";
import "./Privacy.css";
import {
  ShieldCheck,
  Lock,
  Database,
  UserCheck,
  KeyRound,
} from "lucide-react";

const privacyItems = [
  {
    icon: <Lock size={36} />,
    title: "End-to-End Protection",
    text: "Your conversations and business discussions are securely encrypted from start to finish.",
  },
  {
    icon: <UserCheck size={36} />,
    title: "Private AI Sessions",
    text: "Every AI boardroom session remains private and accessible only to you.",
  },
  {
    icon: <ShieldCheck size={36} />,
    title: "No Unauthorized Sharing",
    text: "We never share your information without your permission.",
  },
  {
    icon: <KeyRound size={36} />,
    title: "Secure Authentication",
    text: "Strong authentication helps keep your BoardRoom AI account protected.",
  },
];

export default function Privacy() {
  return (
    <section className="privacy-section">

      <div className="privacy-badge">
        🔒 PRIVACY & SECURITY
      </div>

      <h2 className="privacy-title">
        Your <span>Ideas</span> Stay Yours.
      </h2>

      <p className="privacy-subtitle">
        We protect every discussion, strategy, and decision with enterprise-grade security.
      </p>

      <div className="privacy-grid">

        {privacyItems.map((item, index) => (

          <div className="privacy-card" key={index}>

            <div className="privacy-icon">
              {item.icon}
            </div>

            <h3>{item.title}</h3>

            <p>{item.text}</p>

          </div>

        ))}

      </div>

    </section>
  );
}