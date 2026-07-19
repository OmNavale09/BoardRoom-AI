import React, {useEffect,useRef} from "react";
import BoardroomInput from "./input"; 
import { LuExternalLink, LuFolder } from 'react-icons/lu';
import toast, { Toaster } from 'react-hot-toast';
import './chat.css';

// Mapping roles to their corresponding target emojis
const boardMembers = [
  { role: "Investor", icon: "💰" },
  { role: "CTO", icon: "⚙️" },
  { role: "Product & UX Lead", icon: "🎨" },
  { role: "Marketing & Growth", icon: "📈" },
  { role: "Security & Privacy", icon: "🔒" },
  { role: "Customer Representative", icon: "👤" },
  { role: "Devil's Advocate", icon: "😈" },
  { role: "Chairperson (Moderator)", icon: "👨‍⚖️" }
];

export default function Chat({ handleBoardSubmit, list, nextDecision, isPaused, onToggleAction, onSendMessage, handleVote}) {
  const messagesEndRef = useRef(null);

  // 3. Auto-scroll function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  // 4. Trigger auto-scroll whenever the list changes OR a new speaker starts typing
  useEffect(() => {
    scrollToBottom();
  }, [list, nextDecision?.nextSpeaker]);

  useEffect(() => {
    if (nextDecision && nextDecision.reason) {
      toast(nextDecision.reason, {
        duration: 4000,
        position: 'top-right',
        icon: '👨‍⚖️', // Chairperson icon
        // Theme matching your UI: Dark container, neon text, light text body
        style: {
          border: '1px solid #6366f1',
          padding: '16px',
          color: '#e2e8f0',
          background: '#1e1e24',
          borderRadius: '8px',
          fontSize: '14px',
          maxWidth: '350px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
        },
      });
    }
  }, [nextDecision]);
  // Helper to fetch the correct icon matching the structural layout payload rules
  const getAgentIcon = (agentName) => {
    if (!agentName) return "🤖";
    if (agentName.toLowerCase() === "user") return "👤";
    
    // Exact structural or loose match inside role titles
    const matchedMember = boardMembers.find(
      (m) => m.role.toLowerCase() === agentName.toLowerCase() || 
             agentName.toLowerCase().includes(m.role.toLowerCase().split(" ")[0])
    );
    
    return matchedMember ? matchedMember.icon : "😈";
  };

  return (
    <div className="chat-container">
      {/* Scrollable container for conversation logs */}
      <Toaster />
      <div className="messages-log">
        {list.map((msg, index) => {
          const isUser = msg.agent?.toLowerCase() === "user";
          const agentIcon = getAgentIcon(msg.agent);

          return (
            <div
              key={index}
              className={`message-row ${isUser ? "user-alignment" : "agent-alignment"}`}
            >
              <div className="message-bubble">
                <div className="message-header">
                  <span className="agent-icon-span">{agentIcon}</span> {msg.agent}
                </div>
                
                {/* Render project title if it exists */}
                {msg.title && (
                  <div className="message-title-text">{msg.title}</div>
                )}
                
                <div className="message-content">{msg.content}</div>
                
                {msg.github && (
                  <div className="message-meta">
                    <span className="meta-label">
                      <LuFolder size={16} className="folder-icon" /> Repository:
                    </span> 
                    <a href={msg.github} target="_blank" rel="noreferrer" className="repo-link">
                      <span className="full-url">{msg.github}</span>
                      <span className="short-url">
                        Click here <LuExternalLink size={14} className="link-icon" />
                      </span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Dynamic Multi-Agent 3-Dots Typing indicator indicator */}
        {!isPaused && nextDecision && nextDecision.nextSpeaker && (
          <div className="message-row agent-alignment">
            <div className="message-bubble loading-bubble">
              <div className="message-header">
                <span className="agent-icon-span">{getAgentIcon(nextDecision.nextSpeaker)}</span> 
                {nextDecision.nextSpeaker} <span className="action-hint">({nextDecision.action || 'thinking'}...)</span>
              </div>
              <div className="typing-dots">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* Floating container with no background color */}
      <div className="chat-input-floating">
        <BoardroomInput onSubmit={onSendMessage} isStarted={true} isPaused={isPaused} onToggleAction={onToggleAction} handleVote={handleVote}/>
      </div>
    </div>
  );
}