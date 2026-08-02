import React from "react";
import "./Terms.css";
import {
  Bot,
  ShieldCheck,
  FileText,
  Scale,
} from "lucide-react";

const terms = [
  {
    icon: <Bot size={36} />,
    title: "Fair AI Usage",
    text: "Use BoardRoom AI responsibly and ethically. Avoid misuse, harmful activities, or generating misleading content.",
  },
  {
    icon: <ShieldCheck size={36} />,
    title: "User Responsibility",
    text: "Keep your account secure and protect your credentials. You are responsible for activities under your account.",
  },
  {
    icon: <FileText size={36} />,
    title: "AI-Generated Content",
    text: "AI recommendations are provided for assistance. Always review outputs before making important business decisions.",
  },
  {
    icon: <Scale size={36} />,
    title: "Compliance",
    text: "Use BoardRoom AI in accordance with applicable laws, regulations, and organizational policies.",
  },
];

export default function Terms() {
  return (
    <section className="terms-section">

      <div className="terms-badge">
        📋 TERMS & CONDITIONS
      </div>

      <h2 className="terms-title">
        Clear <span>Rules.</span> Trusted Experience.
      </h2>

      <p className="terms-subtitle">
        We believe in responsible AI usage. These simple principles help keep
        BoardRoom AI secure, reliable, and valuable for everyone.
      </p>

      <div className="terms-grid">

        {terms.map((item, index) => (

          <div className="terms-card" key={index}>

            <div className="terms-icon">
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