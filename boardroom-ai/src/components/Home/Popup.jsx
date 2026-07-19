import React from 'react';
import './Popup.css';

const boardMembers = [
  {
    role: "Investor",
    icon: "💰",
    focus: ["Market size", "Business model", "Competition", "Scalability", "Funding readiness"],
    question: "Would I invest in this startup?"
  },
  {
    role: "CTO",
    icon: "⚙️",
    focus: ["Code quality (GitHub repo)", "Architecture", "Scalability", "Tech stack", "Development feasibility"],
    question: "Can this actually be built and maintained?"
  },
  {
    role: "Product & UX Lead",
    icon: "🎨",
    focus: ["User experience", "Product flow", "Feature prioritization", "Accessibility", "Product-market fit"],
    question: "Will users actually enjoy using this?"
  },
  {
    role: "Marketing & Growth",
    icon: "📈",
    focus: ["Go-to-market strategy", "Positioning", "Customer acquisition", "Branding", "Virality"],
    question: "Can people discover and adopt this product?"
  },
  {
    role: "Security & Privacy",
    icon: "🔒",
    focus: ["Authentication", "Data protection", "Security risks", "Privacy", "Compliance basics"],
    question: "Is this safe enough to launch?"
  },
  {
    role: "Customer Representative",
    icon: "👤",
    focus: ["Pain points", "Trust", "Ease of use", "Value proposition"],
    question: "Would I actually use and recommend this?"
  },
  {
    role: "Devil's Advocate",
    icon: "😈",
    isDifferentiator: true,
    focus: ["Challenge assumptions", "Find blind spots", "Ask difficult questions", "Worst-case scenarios"],
    question: "What if Google launches this next month? Why switch from existing solutions?"
  },
  {
    role: "Chairperson (Moderator)",
    icon: "👨‍⚖️",
    isModerator: true,
    focus: ["Controls discussion", "Invites agents to speak", "Tracks agreements/disagreements", "Summarizes & conducts voting", "Generates final report"],
    question: "Manages the multi-agent meeting workflow."
  }
];

export default function Popup({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-container" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h2>Board Members</h2>
          <button className="popup-close-btn" onClick={onClose} aria-label="Close popup">&times;</button>
        </div>
        
        <div className="popup-body">
          <p className="popup-subtitle">Your AI Executive Board for Product & Startup Decisions</p>
          <div className="members-grid">
            {boardMembers.map((member, index) => (
              <div 
                key={index} 
                className={`member-card ${member.isDifferentiator ? 'differentiator-card' : ''}`}
              >
                {/* Left Side: Icon & Meta */}
                <div className="member-main-info">
                  <div className="member-icon-box">
                    <span>{member.icon}</span>
                  </div>
                  <h3 className="member-role-title">
                    {member.role}
                    {member.isDifferentiator && <span className="diff-tag">⭐ Core feature</span>}
                  </h3>
                  <p className="member-quote">“{member.question}”</p>
                </div>

                {/* Right Side / Bottom: Focus List */}
                <div className="member-focus-box">
                  <h4>{member.isModerator ? "Responsibilities" : "Core Focus"}</h4>
                  <ul className="member-focus-list">
                    {member.focus.map((item, fIndex) => (
                      <li key={fIndex}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
