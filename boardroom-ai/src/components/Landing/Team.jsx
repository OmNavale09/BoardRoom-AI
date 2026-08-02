import ceo from "../../assets/ceo.png";
import cfo from "../../assets/cfo.png";
import cto from "../../assets/cto.png";
import cmo from "../../assets/cmo.png";
import coo from "../../assets/coo.png";
import legal from "../../assets/legal.png";
import HR from "../../assets/HR.png";
import React from "react";
import "./Team.css";
import {
  Crown,
  DollarSign,
  Megaphone,
  Laptop,
  Scale,
  Users,
  Briefcase,
  MessageCircle,
} from "lucide-react";

const executives = [
  {
title:"Chairperson",
subtitle:"Orchestrator",
image:ceo,
icon:<Crown size={26}/>,
color:"purple",
details:[
"Controls discussion",
"Invites agents to speak",
"Tracks agreements/disagreements",
"Summarizes & conducts voting",
"Generates final report"
]
},
  {
title:"Investor",
subtitle:"Financier",
image:cfo,
icon:<Crown size={26}/>,
color:"purple",
details:[
"Market size",
"Business model",
"Competition",
"Scalability",
"Funding readiness"
]
},
  {
title:"CTO",
subtitle:"Innovator",
image:cto,
icon:<Crown size={26}/>,
color:"purple",
details:[
"Code quality(GitHub repo)",
"Architecture",
"Scalability",
"Tech stack",
"Development feasibility"
]
},
  {
title:"Marketing",
subtitle:"Promoter",
image:cmo,
icon:<Crown size={26}/>,
color:"purple",
details:[
"Go-to-market strategy",
"Positioning",
"Customer acquisition",
"Branding",
"Virality"
]
},
  {
title:"Security",
subtitle:"Guardian",
image:legal,
icon:<Crown size={26}/>,
color:"purple",
details:[
"Authentication",
"Data protection",
"Security risks",
"Privacy",
"Compliance basics"
]
},
  {
title:"DevilsAdvocate",
subtitle:"Challenger",
image:HR,
icon:<Crown size={26}/>,
color:"purple",
details:[
"Challenge assumptions",
"Find blind spots",
"Ask difficult questions",
"Worst-case scenarios"
]
},
  {
title:"CustomerRepresentative",
subtitle:"Advocate",
image:coo,
icon:<Crown size={26}/>,
color:"purple",
details:[
"Pain points",
"Trust",
"Ease of use",
"Value proposition"
]
},
];

export default function Team() {
  return (
    <section className="team-section">

      <div className="team-badge">
        ✨ MEET YOUR AI EXECUTIVES
      </div>

      <h2 className="team-title">
        Where <span>AI Leaders</span> Think Together.
      </h2>

      <div className="team-grid">

        {executives.map((member, index) => (

          <div
            key={index}
            className={`team-card ${member.color}`}
          >

            <div className="card-top">

              <div className="chat-icon">
                <MessageCircle size={18} />
              </div>

            </div>

            <div className="robot-image">

                <img
                   src={member.image}
                   alt={member.title}
               />

           </div>

            <h3>{member.title}</h3>

            <p>{member.subtitle}</p>

            <div className="hover-content">

              <ul>

                {member.details.map((item, i) => (
                  <li key={i}>✓ {item}</li>
                ))}

              </ul>

              <button>
                Chat with {member.title}
              </button>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}