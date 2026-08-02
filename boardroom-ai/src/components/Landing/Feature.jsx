import React from "react";
import "./Feature.css";

import {
  Brain,
  Users,
  Rocket,
  ShieldCheck,
  BarChart3,
  Target,
  Building2,
  GraduationCap,
  Laptop,
  Briefcase,
  Sparkles,
} from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: Brain,
      title: "Specialized AI Experts",
      text: "Dedicated AI members for HR, Finance, Marketing, Strategy, Technology and more."
    },
    {
      icon: Users,
      title: "Multi-AI Collaboration",
      text: "Multiple AI experts discuss together before providing recommendations."
    },
    {
      icon: Sparkles,
      title: "Instant Idea Validation",
      text: "Evaluate strengths, weaknesses, risks and opportunities within minutes."
    },
    {
      icon: BarChart3,
      title: "Data-Driven Insights",
      text: "Receive intelligent recommendations backed by strategic analysis."
    },
    {
      icon: ShieldCheck,
      title: "Secure Workspace",
      text: "Your ideas, conversations and plans stay protected and private."
    },
  ];

  const users = [
    {
      icon: Rocket,
      title: "Startups",
      text: "Validate ideas and launch products with confidence."
    },
    {
      icon: Briefcase,
      title: "Business Owners",
      text: "Your personal AI advisory board for smarter decisions."
    },
    {
      icon: GraduationCap,
      title: "Students",
      text: "Perfect for hackathons, startup ideas and innovation projects."
    },
    {
      icon: Laptop,
      title: "Developers",
      text: "Plan products, prioritize features and build better solutions."
    },
    {
      icon: Users,
      title: "Teams",
      text: "Collaborate faster with multiple AI perspectives."
    },
    {
      icon: Building2,
      title: "Enterprises",
      text: "Scale decision making across every department."
    },
  ];

  return (
    <section className="features-section" id="features">

      <div className="particles">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className="section-top">

        <span className="badge">
          ✨ Everything You Need
        </span>

        <h2>
          Why Choose <span>BoardRoom AI?</span>
        </h2>

        <p>
          Powerful AI capabilities designed to help you think,
          collaborate and make smarter business decisions.
        </p>

      </div>

      <div className="feature-grid">

        {/* LEFT PANEL */}

        <div className="panel">

          <div className="panel-heading">
            <Sparkles size={22}/>
            <h3>Powerful Features</h3>
          </div>

          {features.map((item,index)=>{

            const Icon=item.icon;

            return(

              <div className="item" key={index}>

                <div className="left-border"></div>

                <div className="icon-box">
                  <Icon size={24}/>
                </div>

                <div className="text">

                  <h4>{item.title}</h4>

                  <p>{item.text}</p>

                </div>

              </div>

            )

          })}

        </div>

        {/* RIGHT PANEL */}

        <div className="panel">

          <div className="panel-heading">
            <Users size={22}/>
            <h3>Built For</h3>
          </div>

          {users.map((item,index)=>{

            const Icon=item.icon;

            return(

              <div className="item" key={index}>

                <div className="left-border"></div>

                <div className="icon-box">
                  <Icon size={24}/>
                </div>

                <div className="text">

                  <h4>{item.title}</h4>

                  <p>{item.text}</p>

                </div>

              </div>

            )

          })}

        </div>

      </div>

    </section>
  );
}