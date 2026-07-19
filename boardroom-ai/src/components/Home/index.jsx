import React, { useState, useEffect } from 'react';
import Cookies from "js-cookie";
import socket from './socket';
import Sidebar from '../Sidebar';
import { FiMenu, FiPaperclip } from 'react-icons/fi';
import { IoSend } from 'react-icons/io5';
import Popup from './Popup';
import Chat from './chat';
import BoardInput from './input';
import './index.css';

export default function Home() {
  const [activeChatId, setActiveChatId] = useState(null);
  const [isStarted, setStarted] = useState(false)
  const [messageList, setmessageList] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [nextDecision, setNextDecision] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [user, setUser] = useState({
  username: "",
  email: "",
});

useEffect(() => {
  const fetchUser = async () => {
    try {
      const token = Cookies.get("token");

      const response = await fetch("http://localhost:5000/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch user");
      }

      setUser(result.user);
    } catch (err) {
      console.error(err);
    }
  };

  fetchUser();
}, []);
  
useEffect(() => {
  const fetchMeetings = async () => {
    try {
      const token = Cookies.get("token");

      const response = await fetch("http://localhost:5000/meeting/titles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch meetings");
      }
      setMeetings(result.meetings);
    } catch (err) {
      console.error(err);
    }
  };
  fetchMeetings();
}, []);

useEffect(() => {
    socket.on("meeting-message", (message) => {
        setmessageList(prev => [
            ...prev,
            message
        ]);
    });
    socket.on("meeting-decision", (decision) => {
        setNextDecision(decision);
    });
    socket.on("meeting-completed", () => {
        console.log("Meeting completed");
    });
    return () => {
        socket.off("meeting-message");
        socket.off("meeting-decision");
        socket.off("meeting-completed");
    };
}, []);

useEffect(() => {
  if (activeChatId === null){
    setStarted(false)
  }
  if (!activeChatId) return;
  const fetchMessages = async () => {
    try {
      const token = Cookies.get("token");

      const response = await fetch(
        `http://localhost:5000/meetings/${activeChatId}/messages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch messages");
      }
      setmessageList(result.messages);
      // Show chat screen when an existing meeting is opened
      console.log(result.meeting.status)
      if(result.meeting.status === "paused"){
        setIsPaused(true)
      } else {
        setIsPaused(false);
      }
      setStarted(true);

      // Join the socket room for this meeting
      socket.emit("join-meeting", activeChatId);
    } catch (err) {
      console.error(err);
    }
  };
  fetchMessages();
}, [activeChatId]);

const handleSendMessage = async (data) => {
  const {mainInput} = data
  if (!activeChatId) return;
  const userMessage = {
    agent: "User",
    type: "speaking",
    content: mainInput
  };
  // Optimistic UI update
  setmessageList(prev => [
    ...prev,
    userMessage
  ]);
  try {
    const token = Cookies.get("token");

    const response = await fetch(
      `http://localhost:5000/meetings/${activeChatId}/action`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: "user_message",
          content: mainInput
        }),
      }
    );
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to send message");
    }
    console.log("User message sent:", result);

  } catch (err) {
    console.error(err);
  }
};

const handleVote = async () => {
    if (!activeChatId) return;
    
    const targetAction = "vote";
    try {
      const token = Cookies.get("token");
      const response = await fetch(`http://localhost:5000/meetings/${activeChatId}/action`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: targetAction }),
      });

      if (!response.ok) {
        const errResult = await response.json();
        throw new Error(errResult.message || `Failed to ${targetAction} meeting`);
      }
      console.log(`Meeting status updated successfully to: ${targetAction}`);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
};

const handleToggleMeetingAction = async () => {
    if (!activeChatId) return;
    
    const targetAction = isPaused ? "resume" : "pause";
    try {
      const token = Cookies.get("token");
      const response = await fetch(`http://localhost:5000/meetings/${activeChatId}/action`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: targetAction }),
      });

      if (!response.ok) {
        const errResult = await response.json();
        throw new Error(errResult.message || `Failed to ${targetAction} meeting`);
      }

      // Flip local state variant cleanly on success response
      setIsPaused(!isPaused);
      console.log(`Meeting status updated successfully to: ${targetAction}`);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
};

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
  };

const handleBoardSubmit = async (data) => {
  try {
    // Show chat screen immediately
    setStarted(true);

    // Display the user's first message
    setmessageList((prev) => [
      ...prev,
      {
        agent: "User",
        type: "speaking",
        title: data.title,
        content: data.mainInput,
        github: data.githubRepo,
      },
    ]);

    const token = Cookies.get("token");

    const response = await fetch("http://localhost:5000/meetings/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        projectId: data.projectId,
        title: data.title,
        github: data.githubRepo,
        text: data.mainInput,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to start meeting");
    }

    console.log("Meeting Started:", result);

    const meetingId = result.meeting._id;
    setIsPaused(false);

setMeetings(prev => [
  {
    meetingId,
    meetingTitle: result.meeting.title,
    status: result.meeting.status,
    projectId: result.meeting.project,
    projectTitle: data.title
  },
  ...prev
]);

    // Save meeting id
    setActiveChatId(meetingId);

    // Join socket room
    socket.emit("join-meeting", meetingId);

  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

  return (
    <div className="boardroom-app">
      {/* Sidebar Responsive Wrapper Container */}
      <div className={`sidebar-wrapper ${isSidebarOpen ? 'open' : ''}`}>
        <Sidebar currentChatId={activeChatId} onSelectChat={setActiveChatId} meetings={meetings} name={user.username}/>
        {/* Clickable backdrop overlay to dismiss drawer on mobile viewports */}
        {isSidebarOpen && (
          <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
        )}
      </div>

      {/* Main Boardroom Workspace */}
      <main className="main-content">
        <div className="header-actions">
          {/* Hamburger Menu Toggle (Only active on viewports < 768px) */}
          <button 
            type="button"
            className="menu-toggle-btn" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle Boardroom Menu"
          >
            {/* Replaced hamburger SVG with FiMenu */}
            <FiMenu size={24} />
          </button>
          
          <span className="badge" onClick={() => setIsPopupOpen(true)}>Board Members</span>
        </div>
        <Popup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />

        {!isStarted? (<div className="center-container">
          <div className="brand-section">
            <h1 className="main-title">BoardRoom AI</h1>
            <p className="subtitle">Your AI Executive Board for Product & Startup Decisions</p>
          </div>

          {/* Quick Action Interactive Suggestions Panel */}
          <div className="suggestions-grid">
            <div 
              className="suggestion-card" 
              onClick={() => handleSuggestionClick("Security, challenge the CTO's choice of technology.")}
            >
              <p className="card-text">"Security, challenge the CTO's choice of technology."</p>
              <span className="card-action">Cross Examine ⚡</span>
            </div>
            <div 
              className="suggestion-card" 
              onClick={() => handleSuggestionClick("Investor, run a market size analysis on our pitch deck.")}
            >
              <p className="card-text">"Investor, run a market size analysis on our pitch deck."</p>
              <span className="card-action">Analyze Pitch →</span>
            </div>
            <div 
              className="suggestion-card" 
              onClick={() => handleSuggestionClick("Call a vote: Are we ready to launch next month?")}
            >
              <p className="card-text">"Call a vote: Are we ready to launch next month?"</p>
              <span className="card-action">Live Voting 📊</span>
            </div>
          </div>
          <BoardInput onSubmit={handleBoardSubmit} />
        </div>) : <Chat handleBoardSubmit={handleBoardSubmit} list={messageList} nextDecision={nextDecision}
          isPaused={isPaused}
          onToggleAction={handleToggleMeetingAction}
          onSendMessage={handleSendMessage}
          handleVote={handleVote}
        />}
      </main>
    </div>
  );
}