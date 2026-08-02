import "./HowItWorks.css";
import React from "react";
import {
  Lightbulb,
  Users,
  FileText,
  ArrowRight,
} from "lucide-react";


const steps = [
  {
    id: "01",
    title: "Share Your Idea",
    description:
      "Describe your startup idea, business challenge, or business goal.",
    icon: <Lightbulb size={34} />,
    color: "step-blue",
  },
  {
    id: "02",
    title: "AI Board Discussion",
    description:
      "CEO AI, CTO AI, CFO AI, Marketing AI, HR AI, Legal AI, Investor AI and Operations AI work together to evaluate your idea.",
    icon: <Users size={34} />,
    color: "step-purple",
  },
  {
    id: "03",
    title: "Strategic Report",
    description:
      "Receive strengths, weaknesses, risks, opportunities and a complete execution roadmap.",
    icon: <FileText size={34} />,
    color: "step-green",
  },
];

export default function HowItWorks() {
  return (
    <section className="how-section" id="how-it-works">

      <div className="how-header">
        <span className="how-badge">
          🚀 HOW IT WORKS
        </span>

        <h2 className="how-title">
          How <span>BoardRoom AI</span> Works
        </h2>

        <p className="how-subtitle">
          Three simple steps to transform your startup idea into strategic business decisions.
        </p>
      </div>

      <div className="workflow-container">

        {steps.map((step, index) => (
          <React.Fragment key={step.id}>

            <div className="workflow-card">

              <div className="workflow-top">

                <div className={`workflow-icon ${step.color}`}>
                  {step.icon}
                </div>

                <span className="workflow-number">
                  {step.id}
                </span>

              </div>

              <h3>{step.title}</h3>

              <p>{step.description}</p>

            </div>

            {index < steps.length - 1 && (
              <div className="workflow-arrow">

                <div className="circle">

                  <ArrowRight size={18} />

                </div>

              </div>
            )}

          </React.Fragment>
        ))}

      </div>

    </section>
  );
}